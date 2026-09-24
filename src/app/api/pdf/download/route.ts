import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserByEmail, isValidUuid } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

/**
 * Secure Proxy Endpoint for Cover Page PDF Streaming
 * Eliminates raw signed URL exposure and prevents opening empty 'about:blank' tabs.
 * Enforces ownership verification: users can only download their own generated documents.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized. Please log in to download this document." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { searchParams } = new URL(request.url);
    const coverPageId = searchParams.get("id");
    const isInline = searchParams.get("inline") === "true";

    if (!coverPageId || !isValidUuid(coverPageId)) {
      return new NextResponse(
        JSON.stringify({ error: "Valid coverPageId parameter is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const adminSupabase = createAdminClient();

    // Resolve user UUID
    let userId = session.user.id;
    if (!isValidUuid(userId) && session.user.email) {
      const dbUser = await getUserByEmail(adminSupabase, session.user.email);
      if (dbUser) {
        userId = dbUser.id;
      }
    }

    // Fetch the cover_pages record
    const { data: record, error: fetchError } = await adminSupabase
      .from("cover_pages")
      .select("id, user_id, pdf_storage_path, form_data, templates(name)")
      .eq("id", coverPageId)
      .single();

    if (fetchError || !record) {
      return new NextResponse(
        JSON.stringify({ error: "Cover page document not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify document ownership
    if (record.user_id !== userId) {
      return new NextResponse(
        JSON.stringify({ error: "Forbidden. You do not have permission to access this document." }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!record.pdf_storage_path) {
      return new NextResponse(
        JSON.stringify({ error: "PDF binary storage path is missing from record." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Download PDF stream directly from private Supabase Storage bucket
    const { data: fileData, error: downloadError } = await adminSupabase.storage
      .from("cover-pages")
      .download(record.pdf_storage_path);

    if (downloadError || !fileData) {
      console.error("Supabase Storage stream error:", downloadError);
      return new NextResponse(
        JSON.stringify({ error: "Failed to stream document binary from archive." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Derive a clean, descriptive filename from assignment title or template name
    const formData = (record.form_data as Record<string, string>) || {};
    const title =
      formData.assignmentTitle ||
      (record.templates as { name?: string } | null)?.name ||
      "academic-cover-page";
    const safeFilename = `${title.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.pdf`;

    const disposition = isInline
      ? `inline; filename="${safeFilename}"`
      : `attachment; filename="${safeFilename}"`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal streaming error";
    console.error("PDF download proxy error:", err);
    return new NextResponse(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
