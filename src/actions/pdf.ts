"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  getTemplateById,
  getLogoById,
  getLogoSignedUrl,
  createCoverPageRecord,
  getUserByEmail,
  upsertUserProfile,
  getUserProfile,
  isValidUuid,
} from "@/lib/supabase/queries";
import { renderTemplateHtml, type MarginOptions } from "@/lib/templates/render-html";
import { resolveTemplateId } from "@/lib/templates/slugs";
import { renderHtmlToPdf } from "@/lib/pdf/render-pdf";
import { revalidatePath } from "next/cache";

export interface GeneratePdfPayload {
  templateId: string;
  formData: Record<string, string>;
  logoId?: string | null;
  marginOptions?: MarginOptions;
}

export interface GeneratePdfResult {
  success: boolean;
  error?: string;
  downloadUrl?: string;
  coverPageId?: string;
  pdfStoragePath?: string;
}

/**
 * Server Action: Compiles template HTML, executes Puppeteer PDF generation,
 * archives the binary in Supabase Storage, and registers the cover_pages record.
 */
export async function generateCoverPagePdfAction(
  payload: GeneratePdfPayload
): Promise<GeneratePdfResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return { success: false, error: "Authentication required to generate PDF cover pages." };
    }

    const adminSupabase = createAdminClient();

    // 1. Resolve effective User UUID from session or database lookup
    let userId = session.user.id;

    if (!isValidUuid(userId) && session.user.email) {
      const dbUser = await getUserByEmail(adminSupabase, session.user.email);
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    if (!isValidUuid(userId)) {
      return {
        success: false,
        error: "Active user record not found in database. Please log in again.",
      };
    }

    // 2. Fetch the target Template definition (resolves slug or UUID)
    const canonicalTemplateId = resolveTemplateId(payload.templateId);
    const template = await getTemplateById(adminSupabase, canonicalTemplateId);
    if (!template) {
      return { success: false, error: "Requested cover page template not found." };
    }

    // 3. Resolve and sign Logo if selected
    let signedLogoUrl: string | null = null;
    if (payload.logoId && isValidUuid(payload.logoId)) {
      const logo = await getLogoById(adminSupabase, payload.logoId);
      if (logo) {
        signedLogoUrl = await getLogoSignedUrl(adminSupabase, logo.storage_path, 3600);
      }
    }

    // 4. Render validated, XSS-escaped HTML with margin options
    const compiledHtml = renderTemplateHtml({
      htmlTemplate: template.html_template,
      formData: payload.formData,
      logoUrl: signedLogoUrl,
      marginOptions: payload.marginOptions,
    });

    // 5. Generate ISO-standard print-ready PDF using Puppeteer service
    const pdfBuffer = await renderHtmlToPdf({
      html: compiledHtml,
      format: "A4",
    });

    // 6. Save binary to private 'cover-pages' Supabase Storage bucket
    const timestamp = Date.now();
    const safeTemplateSlug = template.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const storagePath = `generated/${userId}/${timestamp}-${safeTemplateSlug}.pdf`;

    const { error: uploadError } = await adminSupabase.storage
      .from("cover-pages")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage error uploading PDF:", uploadError);
      return {
        success: false,
        error: `Failed to archive PDF in storage: ${uploadError.message}`,
      };
    }

    // 7. Insert audit record into 'cover_pages' table
    const coverPageRecord = await createCoverPageRecord(adminSupabase, {
      user_id: userId,
      template_id: template.id,
      logo_id: payload.logoId && isValidUuid(payload.logoId) ? payload.logoId : null,
      form_data: payload.formData,
      pdf_storage_path: storagePath,
    });

    // 8. Autofill write-back: merge newly entered values into user_profiles.extra_fields
    try {
      const currentProfile = await getUserProfile(adminSupabase, userId);
      const existingExtra = (currentProfile?.extra_fields as Record<string, unknown>) || {};
      const updatedExtra = { ...existingExtra, ...payload.formData };

      await upsertUserProfile(adminSupabase, {
        user_id: userId,
        full_name: payload.formData.fullName || currentProfile?.full_name || null,
        institution_name: payload.formData.institutionName || currentProfile?.institution_name || null,
        extra_fields: updatedExtra as Record<string, string>,
      });
    } catch (writeBackErr) {
      console.warn("Autofill write-back warning:", writeBackErr);
    }

    // 9. Generate 1-hour signed download URL
    const { data: signedData, error: signError } = await adminSupabase.storage
      .from("cover-pages")
      .createSignedUrl(storagePath, 3600);

    if (signError || !signedData?.signedUrl) {
      console.error("Error creating signed download URL for PDF:", signError);
      return {
        success: false,
        error: "PDF generated successfully but could not sign download URL.",
      };
    }

    revalidatePath("/dashboard");
    revalidatePath("/create");

    return {
      success: true,
      downloadUrl: signedData.signedUrl,
      coverPageId: coverPageRecord.id,
      pdfStoragePath: storagePath,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "PDF rendering pipeline failure";
    console.error("generateCoverPagePdfAction error:", err);
    return { success: false, error: message };
  }
}
