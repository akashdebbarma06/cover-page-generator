import React from "react";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAllTemplates } from "@/lib/supabase/queries";
import { resolveTemplateSlug } from "@/lib/templates/slugs";
import {
  BookOpen,
  Search,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import type { TemplateRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Template Gallery — Student Cover Page Maker",
  description: "Browse standardized institutional cover page templates matching university formats.",
};

// Fallback templates in case of offline development
const FALLBACK_TEMPLATES = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Standard Institutional A4",
    category: "Engineering & Tech",
    formatBadge: "A4 / Letter",
    tag: "Default • Popular",
    description:
      "Best for engineering labs, semester assignments, and project reports requiring official faculty registries.",
    institutionExample: "UNIVERSITY INSTITUTE OF TECHNOLOGY",
    assignmentExample: "LABORATORY ASSESSMENT FINAL: Experimental Analysis of Boundary Layer Separation",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Modern Academic Minimal",
    category: "Minimalist",
    formatBadge: "Letter",
    tag: "Clean Typography",
    description:
      "Suited for essays, seminar papers, and humanities assignments needing clean typographic breathing room.",
    institutionExample: "DEPARTMENT OF PHILOSOPHY • CAMBRIDGE",
    assignmentExample: "Rethinking Epistemic Authority in Networked Democracies",
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Technical Laboratory Formal",
    category: "Sciences & Math",
    formatBadge: "A4 Standard",
    tag: "Lab Configured",
    description:
      "Pre-configured with experiment number, bench batch, calibration codes, and supervisor sign-off spaces.",
    institutionExample: "DEPT. OF CHEMICAL PHYSICS",
    assignmentExample: "STANDARD LAB REPORT: Spectrophotometric Determination of Reaction Kinetics",
  },
];

export default async function TemplatesPage() {
  let templates: TemplateRow[] = [];

  try {
    const supabase = createServerSupabaseClient();
    templates = await getAllTemplates(supabase);
  } catch (err) {
    console.error("Failed to query templates from Supabase:", err);
  }

  // Display DB templates if available, otherwise display fallback templates
  const displayTemplates =
    templates.length > 0
      ? templates.map((t, idx) => ({
          id: t.id,
          name: t.name,
          category: idx === 1 ? "Minimalist" : idx === 2 ? "Sciences & Math" : "Engineering & Tech",
          formatBadge: idx === 1 ? "Letter" : "A4 / Letter",
          tag: idx === 0 ? "Default • Popular" : idx === 1 ? "Clean Typography" : "Lab Configured",
          description:
            idx === 1
              ? "Suited for essays, seminar papers, and humanities assignments needing clean typographic breathing room."
              : idx === 2
              ? "Pre-configured with experiment number, bench batch, calibration codes, and supervisor sign-off spaces."
              : "Best for engineering labs, semester assignments, and project reports requiring official faculty registries.",
          institutionExample:
            idx === 1
              ? "DEPARTMENT OF PHILOSOPHY • CAMBRIDGE"
              : idx === 2
              ? "DEPT. OF CHEMICAL PHYSICS"
              : "UNIVERSITY INSTITUTE OF TECHNOLOGY",
          assignmentExample:
            idx === 1
              ? "Rethinking Epistemic Authority in Networked Democracies"
              : idx === 2
              ? "STANDARD LAB REPORT: Spectrophotometric Determination of Reaction Kinetics"
              : "LABORATORY ASSESSMENT FINAL: Experimental Analysis of Boundary Layer Separation",
        }))
      : FALLBACK_TEMPLATES;

  return (
    <div className="space-y-8">
      {/* Header matching architecture.pdf Page 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Workspace</span>
            <span>&gt;</span>
            <span className="text-crimson-brand">
              Institutional Catalog • {displayTemplates.length} Formats Calibrated
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Template Gallery
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Choose an institutional standard or formatted style for your submission. Every layout aligns with strict university margin norms and typographical hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-xs font-semibold text-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>NORM COMPLIANCE: ISO 216 &amp; US Letter</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-crimson-brand text-white shadow-sm shrink-0">
            All Templates ({displayTemplates.length})
          </button>
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0">
            Engineering &amp; Tech
          </button>
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0">
            Sciences &amp; Math
          </button>
          <button className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shrink-0">
            Minimalist
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty, style, or course..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand"
          />
        </div>
      </div>

      {/* Grid of Templates per architecture.pdf Page 6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTemplates.map((tmpl) => (
          <div
            key={tmpl.id}
            className="academic-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            {/* Visual Thumbnail Card */}
            <div className="p-5 bg-slate-50/80 border-b border-slate-200 relative aspect-[1/1.2] flex flex-col justify-between font-serif text-slate-800 text-[10px] select-none">
              {tmpl.tag && (
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-crimson-50 text-crimson-brand border border-crimson-200 shadow-sm font-sans">
                  {tmpl.tag}
                </span>
              )}

              <div className="text-center pt-8 space-y-1">
                <p className="font-bold text-slate-900 tracking-wider text-[11px]">
                  {tmpl.institutionExample}
                </p>
                <div className="w-8 h-0.5 bg-crimson-brand mx-auto my-2" />
                <p className="text-[10px] text-slate-600 font-sans max-w-[200px] mx-auto line-clamp-2">
                  {tmpl.assignmentExample}
                </p>
              </div>

              {/* Mock footer on card thumbnail */}
              <div className="flex justify-between items-center text-[9px] font-sans text-slate-500 pt-3 border-t border-slate-200/80">
                <div>
                  <p className="font-semibold text-slate-800">Submitted By:</p>
                  <p>Alex Rivera (STU-84920)</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">Date:</p>
                  <p>Autumn Term</p>
                </div>
              </div>
            </div>

            {/* Card Content & Action */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{tmpl.name}</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {tmpl.formatBadge}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                {tmpl.description}
              </p>

              <div className="pt-2">
                <Link
                  href={`/create?template=${resolveTemplateSlug(tmpl.id)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-crimson-brand text-white text-xs font-semibold hover:bg-crimson-hover shadow-sm transition-all"
                >
                  <span>Use This Template</span>
                  <span className="text-xs">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Compliance Guarantee Banner */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-brand flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              Guaranteed Margin &amp; Typography Compliance
            </h4>
            <p className="text-slate-500 mt-0.5">
              All generated pages export directly to vector PDF matching 1-inch (2.54cm) standard margins required by IEEE, APA 7, Chicago 17th, and MLA 9th handbooks.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-crimson-brand font-semibold shrink-0 hover:underline cursor-pointer">
          <span>Read Academic Guidelines</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
