import type { UserProfileRow, TemplateFieldSchema } from "@/lib/supabase/types";

/**
 * Merges a student profile with a template field_schema to produce pre-filled form values.
 * Follows autofill merge logic specified in design.md section 6:
 * 1. Checks user_profiles.extra_fields keys (e.g., student_id, roll_no, registration_no)
 * 2. Checks fixed user_profiles columns (full_name, institution_name, course_details, phone, etc.)
 * 3. Unmatched keys default to defaultValue or empty string.
 *
 * NOTE: Strictly differentiates between the internal platform unique_user_id (immutable)
 * and the student's institutional studentId / roll number (editable).
 */
export function mergeProfileWithSchema(
  fieldSchema: TemplateFieldSchema[],
  profile: UserProfileRow | null,
  platformUniqueUserId?: string
): Record<string, string> {
  const values: Record<string, string> = {};
  const extra = (profile?.extra_fields as Record<string, unknown>) || {};

  // Extract institutional student identifier if present in extra_fields
  const institutionalStudentId =
    (extra.student_id as string) ||
    (extra.studentId as string) ||
    (extra.roll_no as string) ||
    (extra.rollNo as string) ||
    "";

  // Standard field mappings from profile columns
  const profileColumnMap: Record<string, string | null | undefined> = {
    fullName: profile?.full_name,
    studentName: profile?.full_name,
    institutionName: profile?.institution_name,
    institution: profile?.institution_name,
    courseDetails: profile?.course_details,
    course: profile?.course_details,
    phone: profile?.phone,
    phoneNumber: profile?.phone,
    dob: profile?.dob,
    studentId: institutionalStudentId || undefined,
    rollNo: (extra.roll_no as string) || (extra.rollNo as string) || (extra.student_id as string) || undefined,
    registrationNo: (extra.registration_no as string) || (extra.registrationNo as string) || undefined,
    enrollmentNo: (extra.enrollment_no as string) || (extra.enrollmentNo as string) || undefined,
    departmentCode: (extra.department_code as string) || (extra.departmentCode as string) || undefined,
    uniqueUserId: platformUniqueUserId || "STU-84920",
    platformId: platformUniqueUserId || "STU-84920",
  };

  for (const field of fieldSchema) {
    const key = field.name;

    // 1. Check extra_fields JSONB first
    if (extra[key] !== undefined && extra[key] !== null && String(extra[key]).trim() !== "") {
      values[key] = String(extra[key]);
      continue;
    }

    // Also check snake_case variant in extra_fields (e.g. roll_no vs rollNo, student_id vs studentId)
    const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
    if (extra[snakeKey] !== undefined && extra[snakeKey] !== null && String(extra[snakeKey]).trim() !== "") {
      values[key] = String(extra[snakeKey]);
      continue;
    }

    // 2. Check fixed profile column mappings
    if (profileColumnMap[key] !== undefined && profileColumnMap[key] !== null && String(profileColumnMap[key]).trim() !== "") {
      values[key] = String(profileColumnMap[key]);
      continue;
    }

    // 3. Fallback to default value or empty string
    values[key] = field.defaultValue || "";
  }

  return values;
}
