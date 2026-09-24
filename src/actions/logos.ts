"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createLogoRecord,
  deleteLogoRecord,
  getLogoById,
  getLogoSignedUrl,
} from "@/lib/supabase/queries";
import { revalidatePath } from "next/cache";
import type { LogoWithSignedUrl } from "@/lib/supabase/types";

export interface LogoActionResult {
  success: boolean;
  error?: string;
  logo?: LogoWithSignedUrl;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
]);

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3 Megabytes

/**
 * Validates and sanitizes SVG content to prevent SVG-based XSS attacks.
 */
function sanitizeSvg(content: string): boolean {
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /\bon\w+\s*=/gi, // onload, onerror, onclick, etc.
    /<iframe/gi,
    /<embed/gi,
    /<object/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(content)) {
      return false;
    }
  }
  return true;
}

/**
 * Server Action: Uploads an institutional logo to Supabase Storage and records it in database.
 */
export async function uploadStudentLogoAction(
  formData: FormData
): Promise<LogoActionResult> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Authentication required to upload logos." };
    }

    const userId = session.user.id;
    const file = formData.get("file") as File | null;
    const rawName = (formData.get("name") as string | null) || "";

    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select an image file to upload." };
    }

    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        success: false,
        error: "File exceeds the 3MB maximum allowed limit for logo files.",
      };
    }

    // 2. MIME Type Validation
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return {
        success: false,
        error: "Unsupported file type. Please upload a high-resolution PNG, JPG, WEBP, or SVG.",
      };
    }

    // 3. Security Sanitize SVG files
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (mimeType === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
      const svgText = buffer.toString("utf-8");
      if (!sanitizeSvg(svgText)) {
        return {
          success: false,
          error: "Security validation failed: Executable scripts or event handlers are prohibited in SVG logos.",
        };
      }
    }

    // 4. Clean and prepare storage file path
    const cleanFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "_")
      .replace(/_{2,}/g, "_");

    const storagePath = `user-uploads/${userId}/${Date.now()}-${cleanFileName}`;
    const displayName = rawName.trim() || file.name.replace(/\.[^/.]+$/, "");

    // 5. Upload to Supabase Storage
    const adminSupabase = createAdminClient();

    const { error: uploadError } = await adminSupabase.storage
      .from("logos")
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase Storage logo upload error:", uploadError);
      return {
        success: false,
        error: `Storage upload failed: ${uploadError.message}`,
      };
    }

    // 6. Record metadata in 'logos' database table
    const logoRow = await createLogoRecord(adminSupabase, {
      user_id: userId,
      name: displayName,
      storage_path: storagePath,
      is_system: false,
    });

    // 7. Generate a 1-hour signed URL for immediate live preview
    const signedUrl = await getLogoSignedUrl(adminSupabase, storagePath, 3600);

    revalidatePath("/create");

    return {
      success: true,
      logo: {
        ...logoRow,
        signed_url: signedUrl,
      },
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error during logo upload";
    console.error("uploadStudentLogoAction exception:", err);
    return { success: false, error: message };
  }
}

/**
 * Server Action: Deletes a user-owned custom logo.
 */
export async function deleteStudentLogoAction(
  logoId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { success: false, error: "Authentication required." };
    }

    const userId = session.user.id;
    const adminSupabase = createAdminClient();

    // Verify ownership and ensure not a system logo
    const existing = await getLogoById(adminSupabase, logoId);
    if (!existing) {
      return { success: false, error: "Logo not found." };
    }

    if (existing.user_id !== userId || existing.is_system) {
      return {
        success: false,
        error: "Forbidden: You can only delete your own custom uploaded logos.",
      };
    }

    // 1. Remove from Storage
    await adminSupabase.storage.from("logos").remove([existing.storage_path]);

    // 2. Remove from database
    await deleteLogoRecord(adminSupabase, logoId, userId);

    revalidatePath("/create");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error deleting logo";
    return { success: false, error: message };
  }
}
