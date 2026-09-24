import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { ProfileFormContainer } from "@/components/profile/profile-form-container";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/supabase/queries";
import type { ProfileFormValues } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Setup Student Baseline Profile — Cover Maker",
  description: "Configure your persistent academic profile for automated cover page generation.",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session && process.env.NODE_ENV === "production") {
    redirect("/auth/signin");
  }

  const userId = session?.user?.id || "";
  const uniqueUserId = session?.user?.uniqueUserId || "STU-84920";
  const sessionName = session?.user?.name || "Alex Rivera";

  // Default initial values
  let initialValues: ProfileFormValues = {
    fullName: sessionName,
    dob: "2003-09-14",
    institutionName: "Harvard University - Faculty of Arts and Sciences",
    courseDetails: "B.Sc. Computer Science & AI Systems",
    phone: "+1 (555) 392-8190",
    academicYear: "2022 - 2026",
    studentId: "CS22B1044",
    enrollmentNo: "ENR-2022-8812",
    registrationNo: "REG-99401",
    departmentCode: "DEPT-CS-40",
  };

  // Attempt to load existing profile from Supabase if connected
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (userId && supabaseUrl && !supabaseUrl.includes("mock")) {
      const supabase = createServerSupabaseClient();
      const profile = await getUserProfile(supabase, userId);
      if (profile) {
        const extra = (profile.extra_fields as Record<string, unknown>) || {};
        initialValues = {
          fullName: profile.full_name || sessionName,
          dob: profile.dob || "",
          institutionName: profile.institution_name || "",
          courseDetails: profile.course_details || "",
          phone: profile.phone || "",
          academicYear: (extra.academic_year as string) || "2024 - 2028",
          studentId: (extra.student_id as string) || (extra.studentId as string) || "",
          enrollmentNo: (extra.enrollment_no as string) || "",
          registrationNo: (extra.registration_no as string) || "",
          departmentCode: (extra.department_code as string) || "",
        };
      }
    }
  } catch {
    // Graceful fallback to default values in development or disconnected state
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Step Bar matching architecture.pdf Page 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-crimson-brand uppercase">
            <span className="w-5 h-5 rounded-full bg-crimson-brand text-white flex items-center justify-center text-[10px]">
              1
            </span>
            <span>ONBOARDING SEQUENCE • Step 1 of 2</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
            Setup Student Baseline Profile
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Build your verified baseline credentials for automatic cover page autofill across APA, MLA, Chicago, and IEEE standards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-700">Completion</p>
            <p className="text-xs text-crimson-brand font-medium">90% Auto-fill Ready</p>
          </div>
          <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="w-[90%] h-full bg-crimson-brand rounded-full transition-all duration-500" />
          </div>
        </div>
      </div>

      {/* Main interactive form container */}
      <ProfileFormContainer
        initialValues={initialValues}
        uniqueUserId={uniqueUserId}
      />
    </div>
  );
}
