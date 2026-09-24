import { NextResponse } from "next/server";
import { generateCoverPagePdfAction } from "@/actions/pdf";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.templateId || !body?.formData) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: templateId and formData." },
        { status: 400 }
      );
    }

    const result = await generateCoverPagePdfAction({
      templateId: body.templateId,
      formData: body.formData,
      logoId: body.logoId || null,
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
