"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, IdCard } from "lucide-react";
import type { ProfileFormValues } from "@/lib/validations/profile";

interface ExtraIdentifiersSectionProps {
  values: ProfileFormValues;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
}

export function ExtraIdentifiersSection({
  values,
  onChange,
}: ExtraIdentifiersSectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="academic-card p-6 md:p-8 space-y-4">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <IdCard className="w-4 h-4 text-accent-purple" />
          <span className="text-sm font-semibold text-slate-800">
            Extra Institutional Identifiers (Optional)
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            4 fields
          </span>
        </div>

        <div className="p-1 rounded text-slate-400 hover:text-slate-600">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Accordion Body */}
      {isOpen && (
        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-4">
            Institutions often require Student ID, Roll, Registration, or Department codes on title sheets.
            Saved values merge automatically into templates that request them.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Student ID / Roll Number */}
            <div>
              <label htmlFor="studentId" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Institutional Student ID / Roll No.
              </label>
              <input
                id="studentId"
                type="text"
                value={values.studentId || ""}
                onChange={(e) => onChange("studentId", e.target.value)}
                placeholder="e.g. CS22B1044 or 2024-STU-001"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Your college/university issued ID (distinct from your platform unique ID).
              </span>
            </div>

            {/* Enrollment No */}
            <div>
              <label htmlFor="enrollmentNo" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Enrollment No.
              </label>
              <input
                id="enrollmentNo"
                type="text"
                value={values.enrollmentNo || ""}
                onChange={(e) => onChange("enrollmentNo", e.target.value)}
                placeholder="e.g. ENR-2022-8812"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                University enrollment or examination index code.
              </span>
            </div>

            {/* Registration No */}
            <div>
              <label htmlFor="registrationNo" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Registration No.
              </label>
              <input
                id="registrationNo"
                type="text"
                value={values.registrationNo || ""}
                onChange={(e) => onChange("registrationNo", e.target.value)}
                placeholder="e.g. REG-99401"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Board or university permanent registration number.
              </span>
            </div>

            {/* Department Code */}
            <div>
              <label htmlFor="departmentCode" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department Code
              </label>
              <input
                id="departmentCode"
                type="text"
                value={values.departmentCode || ""}
                onChange={(e) => onChange("departmentCode", e.target.value)}
                placeholder="e.g. DEPT-CS-40"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Faculty or departmental abbreviation code.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
