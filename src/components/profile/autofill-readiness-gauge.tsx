"use client";

import React from "react";
import { CheckCircle, Shield, ArrowRight, Loader2 } from "lucide-react";

interface AutofillReadinessGaugeProps {
  percentage: number;
  isSaving: boolean;
  onSave: (redirectAfter: boolean) => void;
}

export function AutofillReadinessGauge({
  percentage,
  isSaving,
  onSave,
}: AutofillReadinessGaugeProps) {
  const isHighReady = percentage >= 80;

  return (
    <div className="space-y-6">
      {/* Readiness Banner per architecture.pdf Page 4 */}
      <div className="academic-card p-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Circular Percentage Meter */}
          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isHighReady ? "text-crimson-brand" : "text-amber-500"}
                strokeDasharray={`${percentage}, 100`}
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-[11px] font-bold text-slate-800 font-mono">
              {percentage}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">
                {percentage}% Auto-fill Ready
              </span>
              {isHighReady && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle className="w-3 h-3" />
                  Valid Schema
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All foundational fields qualified for standard IEEE, APA 7, and MLA 9 templates.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          type="button"
          onClick={() => onSave(false)}
          disabled={isSaving}
          className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>

        <button
          type="button"
          onClick={() => onSave(true)}
          disabled={isSaving}
          className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white bg-crimson-brand hover:bg-crimson-hover shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-crimson-brand/40 disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <span>Complete Profile &amp; Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Security & RLS Footnote per architecture.pdf */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-1">
        <Shield className="w-3.5 h-3.5 text-slate-400" />
        <span>Data stored securely with Row Level Security in Supabase Postgres.</span>
      </div>
    </div>
  );
}
