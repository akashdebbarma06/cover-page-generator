"use client";

import React from "react";
import type { ProfileFormValues } from "@/lib/validations/profile";
import { AppLogo } from "@/components/brand/app-logo";
import { RefreshCw } from "lucide-react";

interface LiveCoverPreviewProps {
  values: ProfileFormValues;
  uniqueUserId: string;
}

export function LiveCoverPreview({ values, uniqueUserId }: LiveCoverPreviewProps) {
  const institution = values.institutionName || "Harvard University";
  const fullName = values.fullName || "Alex Rivera";
  const course = values.courseDetails || "B.Sc. Computer Science & AI Systems";
  const academicYear = values.academicYear || "2022 - 2026";
  const regNo = values.registrationNo || "REG-99401";
  const deptCode = values.departmentCode || "DEPT-CS-40";

  return (
    <div className="sticky top-6 space-y-3">
      {/* Preview Header Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-purple opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-purple"></span>
          </span>
          <span className="text-[11px] font-bold tracking-wider text-slate-700 uppercase">
            Dynamic Cover Page Preview
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 font-mono font-medium">
            A4 · APA 7th Ed
          </span>
        </div>
      </div>

      {/* A4 Sheet Canvas matching ISO 216 (1 : 1.414 ratio) */}
      <div className="w-full bg-white rounded-xl border border-slate-300 shadow-xl overflow-hidden aspect-[1/1.414] p-6 sm:p-8 flex flex-col justify-between select-none relative font-serif text-slate-900">
        {/* Subtle grid pattern / margin guideline simulation */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Top Header */}
        <div className="flex justify-between items-center text-[10px] sm:text-xs font-sans text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
          <div>
            <span className="font-semibold text-crimson-brand">ACADEMIC RESEARCH PAPER</span>
            <div className="text-[10px] text-slate-600 font-medium normal-case truncate max-w-[180px] sm:max-w-xs">
              {institution}
            </div>
          </div>
          <div className="text-right">
            <span>Page 1</span>
            <div className="font-mono text-[10px] text-slate-400">{academicYear}</div>
          </div>
        </div>

        {/* Center Title & Insignia Section */}
        <div className="my-auto text-center space-y-4 py-4">
          <div className="flex justify-center">
            <AppLogo size="md" className="shadow-sm" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-sm sm:text-lg font-bold tracking-tight text-slate-900 leading-snug">
              Adaptive Machine Learning in Autonomous Neural Architectures
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500 italic">
              A Term Investigation &amp; Scholarly Capstone
            </p>
          </div>
        </div>

        {/* Bottom Submission Details */}
        <div className="space-y-4 pt-4 border-t border-slate-100 font-sans">
          <div className="text-center space-y-1">
            <p className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
              SUBMITTED BY
            </p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {fullName}
            </p>
            <p className="text-[10px] sm:text-xs text-slate-600 truncate">{course}</p>

            <div className="flex items-center justify-center gap-2 pt-1">
              <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                ID: {uniqueUserId}
              </span>
              {values.registrationNo && (
                <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  REG: {regNo}
                </span>
              )}
            </div>
          </div>

          {/* Department Record & Timestamp footer */}
          <div className="flex justify-between items-center text-[9px] text-slate-400 pt-2 border-t border-slate-50">
            <div>
              <span className="font-semibold text-slate-600">DEPARTMENT RECORD</span>
              <p className="font-mono">{deptCode}</p>
            </div>
            <div className="text-right">
              <span className="font-semibold text-slate-600">SUBMISSION TIMESTAMP</span>
              <p>Today · Live Sync</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Status Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <div className="flex items-center gap-1.5 text-accent-purple font-medium">
          <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: "6s" }} />
          <span>Real-time sync enabled</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">Aspect Ratio: 1 : 1.414</span>
      </div>
    </div>
  );
}
