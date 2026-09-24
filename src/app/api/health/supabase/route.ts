import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (
    !supabaseUrl ||
    !serviceKey ||
    supabaseUrl.includes("mock-project") ||
    serviceKey.includes("mock")
  ) {
    return NextResponse.json({
      status: "unconfigured",
      configured: false,
      message: "Supabase credentials not yet set in .env.local.",
      guide: {
        step1: "Create a Supabase project at https://supabase.com",
        step2: "Go to Project Settings -> API in your Supabase dashboard",
        step3: "Copy Project URL, anon public key, and service_role secret into .env.local",
        step4: "Run supabase/setup_complete.sql in your Supabase SQL Editor",
      },
    });
  }

  try {
    const admin = createAdminClient();

    // Test querying templates table
    const { data: templates, error: templateError } = await admin
      .from("templates")
      .select("id, name")
      .limit(5);

    if (templateError) {
      return NextResponse.json({
        status: "schema_pending",
        configured: true,
        message: "Connected to Supabase, but schema not yet initialized.",
        error: templateError.message,
        actionRequired: "Run the SQL script at supabase/setup_complete.sql in the Supabase SQL Editor.",
      });
    }

    // Test querying users table
    const { count, error: userError } = await admin
      .from("users")
      .select("*", { count: "exact", head: true });

    if (userError) {
      return NextResponse.json({
        status: "partial_schema",
        configured: true,
        message: "Templates table ready, but users table error.",
        error: userError.message,
      });
    }

    return NextResponse.json({
      status: "healthy",
      configured: true,
      message: "Supabase connected and schema verified successfully!",
      templatesCount: templates?.length || 0,
      usersCount: count || 0,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error connecting to Supabase";
    return NextResponse.json({
      status: "connection_error",
      configured: true,
      message: "Failed to connect to Supabase project URL.",
      error: errorMsg,
    });
  }
}
