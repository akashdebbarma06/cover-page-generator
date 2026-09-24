"use client";

import React from "react";
import { User, Calendar, Building2, GraduationCap, Phone, Hash, Info } from "lucide-react";
import type { ProfileFormValues } from "@/lib/validations/profile";

interface BasicCredentialsSectionProps {
  values: ProfileFormValues;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  uniqueUserId: string;
}

export function BasicCredentialsSection({
  values,
  onChange,
  uniqueUserId,
}: BasicCredentialsSectionProps) {
  return (
    <div className="academic-card p-6 md:p-8 space-y-6">
      {/* Header with unique ID tag matching architecture.pdf Page 4 */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 text-crimson-brand font-semibold text-sm">
            <User className="w-4 h-4" />
            <span>Basic Student Credentials</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            This baseline metadata automatically pre-populates every future cover page you generate.
          </p>
        </div>

        <div className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-mono text-slate-700">
          <span className="font-semibold text-accent-purple">{uniqueUserId}</span>
          <Info className="w-3.5 h-3.5 text-slate-400 ml-1" />
        </div>
      </div>

      {/* Two-Column Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Legal Name */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="fullName" className="text-xs font-semibold text-slate-700">
              Full Legal Name <span className="text-crimson-brand">*</span>
            </label>
            <span className="text-[11px] text-slate-400">As per ID card</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="fullName"
              type="text"
              required
              value={values.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              placeholder="e.g. Alex Rivera"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="dob" className="text-xs font-semibold text-slate-700">
              Date of Birth <span className="text-crimson-brand">*</span>
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              id="dob"
              type="date"
              required
              value={values.dob || ""}
              onChange={(e) => onChange("dob", e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>

        {/* School / College Name */}
        <div>
          <label htmlFor="institutionName" className="block text-xs font-semibold text-slate-700 mb-1.5">
            School / College Name <span className="text-crimson-brand">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              id="institutionName"
              type="text"
              required
              value={values.institutionName}
              onChange={(e) => onChange("institutionName", e.target.value)}
              placeholder="e.g. Harvard University - Faculty of Arts and Sciences"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>

        {/* Course & Major */}
        <div>
          <label htmlFor="courseDetails" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Course &amp; Major <span className="text-crimson-brand">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <input
              id="courseDetails"
              type="text"
              required
              value={values.courseDetails}
              onChange={(e) => onChange("courseDetails", e.target.value)}
              placeholder="e.g. B.Sc. Computer Science & AI Systems"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="phone"
              type="tel"
              value={values.phone || ""}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="e.g. +1 (555) 392-8190"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>

        {/* Academic Year / Batch */}
        <div>
          <label htmlFor="academicYear" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Academic Year / Batch <span className="text-crimson-brand">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </div>
            <input
              id="academicYear"
              type="text"
              required
              value={values.academicYear}
              onChange={(e) => onChange("academicYear", e.target.value)}
              placeholder="e.g. 2022 - 2026"
              className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
