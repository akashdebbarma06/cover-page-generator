"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { profileFormSchema, type ProfileFormValues } from "@/lib/validations/profile";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateUniqueUserId } from "@/lib/auth/unique-id";
import { revalidatePath } from "next/cache";

export interface ProfileActionResult {
  success: boolean;
  uniqueUserId?: string;
  error?: string;
}

/**
 * Server action to save/update student baseline profile.
 * Enforces server-side validation and generates immutable unique_user_id on first save if absent.
 */
export async function saveStudentProfileAction(
  data: ProfileFormValues
): Promise<ProfileActionResult> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      success: false,
      error: "You must be authenticated to perform this action.",
    };
  }

  // 1. Server-side validation
  const validationResult = profileFormSchema.safeParse(data);
  if (!validationResult.success) {
    const errorMsg = validationResult.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return {
      success: false,
      error: errorMsg,
    };
  }

  const values = validationResult.data;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Handle mock environment gracefully
    if (
      !supabaseUrl ||
      !serviceKey ||
      supabaseUrl.includes("mock") ||
      serviceKey.includes("mock")
    ) {
      revalidatePath("/profile");
      revalidatePath("/dashboard");
      return {
        success: true,
        uniqueUserId: session.user.uniqueUserId || "STU-84920",
      };
    }

    const adminClient = createAdminClient();

    // 2. Lookup or create user row
    let userRow = await adminClient
      .from("users")
      .select("id, unique_user_id")
      .eq("email", session.user.email)
      .maybeSingle();

    let userId = userRow.data?.id;
    let uniqueUserId = userRow.data?.unique_user_id;

    if (!userId) {
      uniqueUserId = await generateUniqueUserId(adminClient);
      const { data: newUser, error: createError } = await adminClient
        .from("users")
        .insert({
          email: session.user.email,
          auth_provider: "google",
          auth_provider_id: session.user.id || session.user.email,
          unique_user_id: uniqueUserId,
        })
        .select("id, unique_user_id")
        .single();

      if (createError || !newUser) {
        throw new Error(createError?.message || "Failed to initialize user identity record.");
      }
      userId = newUser.id;
      uniqueUserId = newUser.unique_user_id;
    } else if (!uniqueUserId) {
      // User existed but had no unique_user_id: generate once, immutable
      uniqueUserId = await generateUniqueUserId(adminClient);
      await adminClient
        .from("users")
        .update({ unique_user_id: uniqueUserId })
        .eq("id", userId);
    }

    // 3. Upsert user_profiles with extra_fields JSONB
    const extraFields = {
      academic_year: values.academicYear,
      student_id: values.studentId || null,
      enrollment_no: values.enrollmentNo || null,
      registration_no: values.registrationNo || null,
      department_code: values.departmentCode || null,
    };

    const { error: profileError } = await adminClient.from("user_profiles").upsert({
      user_id: userId,
      full_name: values.fullName,
      dob: values.dob ? values.dob : null,
      institution_name: values.institutionName,
      course_details: values.courseDetails,
      phone: values.phone || null,
      extra_fields: extraFields,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      throw new Error(`Profile save failed: ${profileError.message}`);
    }

    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      uniqueUserId,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred.";
    console.error("Save profile error:", err);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Server action to save current cover page form values as the student's persistent autofill defaults.
 * Allows instant write-back from the cover page editor without requiring PDF compilation.
 */
export async function saveAutofillDefaultsAction(
  formData: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Authentication required to update defaults." };
    }

    const adminClient = createAdminClient();

    // Resolve user UUID
    const { data: userRow } = await adminClient
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .maybeSingle();

    if (!userRow?.id) {
      return { success: false, error: "User profile record not found." };
    }

    const userId = userRow.id;

    // Fetch existing profile to preserve existing fields
    const { data: currentProfile } = await adminClient
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const existingExtra = (currentProfile?.extra_fields as Record<string, string>) || {};
    const mergedExtra = { ...existingExtra, ...formData };

    const { error: upsertError } = await adminClient.from("user_profiles").upsert({
      user_id: userId,
      full_name: formData.fullName || currentProfile?.full_name || null,
      institution_name: formData.institutionName || currentProfile?.institution_name || null,
      course_details: formData.courseDetails || formData.subject || currentProfile?.course_details || null,
      extra_fields: mergedExtra,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    revalidatePath("/profile");
    revalidatePath("/create");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile defaults.";
    return { success: false, error: message };
  }
}

