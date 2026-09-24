"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BasicCredentialsSection } from "./basic-credentials-section";
import { ExtraIdentifiersSection } from "./extra-identifiers-section";
import { AutofillReadinessGauge } from "./autofill-readiness-gauge";
import { LiveCoverPreview } from "./live-cover-preview";
import { saveStudentProfileAction } from "@/actions/profile";
import type { ProfileFormValues } from "@/lib/validations/profile";
import { Check, ShieldCheck, AlertCircle } from "lucide-react";

interface ProfileFormContainerProps {
  initialValues: ProfileFormValues;
  uniqueUserId: string;
}

export function ProfileFormContainer({
  initialValues,
  uniqueUserId: initialUniqueUserId,
}: ProfileFormContainerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState<ProfileFormValues>(initialValues);
  const [uniqueUserId, setUniqueUserId] = useState<string>(initialUniqueUserId);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Calculate readiness percentage dynamically based on field completion
  const calculatePercentage = (): number => {
    let score = 0;
    if (values.fullName?.trim()) score += 20;
    if (values.institutionName?.trim()) score += 20;
    if (values.courseDetails?.trim()) score += 20;
    if (values.dob?.trim()) score += 15;
    if (values.academicYear?.trim()) score += 15;
    if (values.enrollmentNo?.trim() || values.registrationNo?.trim()) score += 10;
    return Math.min(score, 100);
  };

  const handleFieldChange = (field: keyof ProfileFormValues, val: string) => {
    setValues((prev) => ({ ...prev, [field]: val }));
    if (notification) setNotification(null);
  };

  const handleSave = (redirectAfter: boolean) => {
    setNotification(null);
    startTransition(async () => {
      const result = await saveStudentProfileAction(values);
      if (result.success) {
        if (result.uniqueUserId) {
          setUniqueUserId(result.uniqueUserId);
        }
        setNotification({
          type: "success",
          message: "Student baseline profile saved successfully.",
        });
        if (redirectAfter) {
          router.push("/dashboard");
          router.refresh();
        }
      } else {
        setNotification({
          type: "error",
          message: result.error || "Failed to save profile. Please check the fields.",
        });
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Form Column (7 Cols on large screens) */}
      <div className="lg:col-span-7 space-y-6">
        {notification && (
          <div
            className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
              notification.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Section 1: Basic Credentials */}
        <BasicCredentialsSection
          values={values}
          onChange={handleFieldChange}
          uniqueUserId={uniqueUserId}
        />

        {/* Section 2: Extra Institutional Identifiers Accordion */}
        <ExtraIdentifiersSection
          values={values}
          onChange={handleFieldChange}
        />

        {/* Section 3: Readiness Gauge & Submit Actions */}
        <AutofillReadinessGauge
          percentage={calculatePercentage()}
          isSaving={isPending}
          onSave={handleSave}
        />

        {/* Bottom Compliance Card per architecture.pdf Page 4 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-purpleLight text-accent-purple flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Institutional Format Compliance</p>
              <p className="text-slate-500">
                Generates standardized cover sheets matching Chicago 17th, APA 7th, and Harvard referencing styles.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Live Preview Column (5 Cols on large screens) */}
      <div className="lg:col-span-5">
        <LiveCoverPreview values={values} uniqueUserId={uniqueUserId} />
      </div>
    </div>
  );
}
