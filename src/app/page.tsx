import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAllTemplates } from "@/lib/supabase/queries";
import { resolveTemplateSlug } from "@/lib/templates/slugs";
import type { TemplateRow } from "@/lib/supabase/types";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FileText,
  Printer,
  Wand2,
  Cpu,
  Layers,
  Download,
  Building,
  Upload,
  Zap,
  Lock,
  ChevronRight,
  ExternalLink,
  LifeBuoy,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Cover Page Maker — Professional Academic Cover Sheets & PDF Generator",
  description:
    "Generate institution-standard, registrar-compliant assignment cover pages in seconds. One-time profile setup, smart autofill, and print-ready vector PDF export.",
};

export default async function HomePage() {
  let templates: TemplateRow[] = [];

  try {
    const supabase = createServerSupabaseClient();
    templates = await getAllTemplates(supabase);
  } catch (err) {
    console.error("Could not fetch templates on landing page:", err);
  }

  // Fallback templates if database unseeded
  if (!templates || templates.length === 0) {
    templates = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Standard Institutional A4",
        preview_image_url: "/templates/standard-a4.png",
        field_schema: new Array(13),
        html_template: "",
        created_at: new Date().toISOString(),
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        name: "Modern Academic Minimal",
        preview_image_url: "/templates/academic-minimal.png",
        field_schema: new Array(7),
        html_template: "",
        created_at: new Date().toISOString(),
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        name: "Technical Laboratory Formal",
        preview_image_url: "/templates/technical-lab.png",
        field_schema: new Array(9),
        html_template: "",
        created_at: new Date().toISOString(),
      },
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-crimson-brand selection:text-white">
      {/* 1. Header & Navigation */}
      <header className="border-b border-slate-200/80 bg-white/85 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <AppLogo size="sm" />
            <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg group-hover:text-crimson-brand transition-colors">
              Student Cover Page Maker
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Platform Features
            </a>
            <a href="#templates" className="hover:text-slate-900 transition-colors">
              Template Gallery
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            <Link href="/support" className="hover:text-slate-900 transition-colors">
              Support Desk
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-2 py-1"
            >
              Sign In
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-crimson-brand text-white text-xs sm:text-sm font-semibold hover:bg-crimson-hover shadow-sm transition-all"
            >
              <span>Create Cover Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-200 bg-linear-to-b from-white via-slate-50 to-slate-100/60">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-accent-purpleLight text-accent-purple border border-accent-purpleBorder shadow-xs animate-in fade-in duration-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ACADEMIC PUBLISHING UTILITY &bull; ISO 216 / A4 COMPLIANT</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-tight">
            Stop Reformatting.
            <br />
            <span className="text-crimson-brand">
              Generate University Cover Pages in Seconds.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-xl text-slate-600 leading-relaxed font-normal">
            Eliminate repetitive manual document setup. Store your student credentials once,
            autofill across all your assignments, and export pixel-perfect, registrar-approved vector
            PDFs.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-crimson-brand text-white text-base font-semibold hover:bg-crimson-hover shadow-lg shadow-crimson-brand/20 hover:shadow-xl transition-all"
            >
              <span>Start Generating Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 text-base font-semibold hover:bg-slate-50 hover:border-slate-400 shadow-xs transition-all"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Browse Template Gallery</span>
            </a>
          </div>

          {/* Trust Metrics Pill Grid */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200/80">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
              <p className="text-xs font-medium text-slate-500">Registrar Compliance</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">0.4s</p>
              <p className="text-xs font-medium text-slate-500">Vector Render Speed</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">300 DPI</p>
              <p className="text-xs font-medium text-slate-500">Lossless Print Quality</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">1-Click</p>
              <p className="text-xs font-medium text-slate-500">Persistent Profile Autofill</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 1: Feature Showcase (Primary Tools) */}
      <section id="features" className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-crimson-50 text-crimson-brand border border-crimson-brand/20">
              <Layers className="w-3.5 h-3.5" />
              <span>COMPREHENSIVE PLATFORM SUITE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built Specifically for Academic Engineering &amp; Research
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              From daily laboratory journals to formal semester capstone dissertations, our integrated
              toolset takes care of every formatting detail.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tool 1: Cover Page Maker */}
            <div className="academic-card p-8 space-y-5 rounded-2xl relative group hover:border-crimson-brand/40 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-crimson-50 text-crimson-brand flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Cover Page Maker</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Dynamic schema-driven form generation tailored to your department. Pre-calibrated
                  for 1.0-inch binding tolerances, faculty evaluation blocks, and official institutional
                  crests.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dynamic field validation per institutional style</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Seeded system crest library &amp; custom SVG upload</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Live synchronized A4 document sheet preview</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-crimson-brand hover:underline"
                >
                  <span>Launch Cover Page Maker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tool 2: PDF Utilities */}
            <div className="academic-card p-8 space-y-5 rounded-2xl relative group hover:border-emerald-500/40 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Academic PDF Pipeline</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Headless Puppeteer compiler generating ISO 32000 compliant vector documents.
                  Embedded web typography, 300 DPI image rendering, and encrypted cloud archival.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Print-ready CMYK/sRGB vector typography</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct AirPrint &amp; signed cloud storage download</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Configurable signature and marking guideline lines</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/preview"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                >
                  <span>Inspect PDF Specifications</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Tool 3: AI Academic Utilities */}
            <div className="academic-card p-8 space-y-5 rounded-2xl relative group hover:border-accent-purple/40 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-accent-purpleLight text-accent-purple flex items-center justify-center group-hover:scale-105 transition-transform">
                <Wand2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">AI Academic Tools</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Smart heuristics that auto-format titles, detect subject codes (e.g. CS-504,
                  MATH-301), and normalize faculty credentials according to university conventions.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Title Case &amp; subtitle hierarchy standardization</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Faculty title and designation auto-completion</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated write-back loop to update student profile</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-purple hover:underline"
                >
                  <span>Experience Smart Formatting</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Section 2: Template Preview (Public Template Gallery) */}
      <section id="templates" className="py-20 sm:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5" />
                <span>PUBLIC TEMPLATE CATALOG</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Preview Curated Institutional Layouts
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Browse our verified cover page formats without needing to register or sign in first.
                Choose a format and start customizing immediately.
              </p>
            </div>

            <Link
              href="/templates"
              className="inline-flex items-center gap-2 text-xs font-bold text-crimson-brand hover:underline self-start md:self-auto"
            >
              <span>View All Templates in App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {templates.map((tpl, idx) => {
              const tags = [
                {
                  label: idx === 0 ? "Flagship Engineering" : idx === 1 ? "Humanities & Thesis" : "Formal Sciences",
                  color: idx === 0 ? "bg-crimson-50 text-crimson-brand border-crimson-brand/20" : idx === 1 ? "bg-accent-purpleLight text-accent-purple border-accent-purpleBorder" : "bg-emerald-50 text-emerald-700 border-emerald-200",
                },
                { label: "ISO A4", color: "bg-slate-100 text-slate-700 border-slate-200" },
              ];

              return (
                <div
                  key={tpl.id}
                  className="academic-card p-6 flex flex-col justify-between rounded-2xl group hover:shadow-xl transition-all"
                >
                  <div className="space-y-4">
                    {/* Visual A4 Thumbnail Mockup */}
                    <div className="w-full aspect-[1/1.3] bg-linear-to-b from-slate-100 to-slate-200/80 rounded-xl border border-slate-200 overflow-hidden relative p-4 flex flex-col justify-between shadow-inner">
                      {/* Top border bar */}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-300/70 pb-2">
                        <span className="font-bold text-slate-600 uppercase tracking-wider text-[9px]">
                          {idx === 0 ? "NATIONAL INSTITUTE" : idx === 1 ? "UNIVERSITY OF CAMBRIDGE" : "CHEMICAL & PHYSICAL LABS"}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson-brand" />
                      </div>

                      {/* Mockup Title & Subtitle */}
                      <div className="text-center space-y-1.5 my-auto px-2">
                        <div className="w-8 h-8 rounded-lg bg-crimson-brand text-white mx-auto flex items-center justify-center text-xs font-bold shadow-xs">
                          🏛
                        </div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">
                          {tpl.name}
                        </p>
                        <p className="text-[10px] text-slate-500 italic">
                          {idx === 0
                            ? "Implementation & Benchmarking of Raft Consensus"
                            : idx === 1
                            ? "A Critical Inquiry in Networked Epistemology"
                            : "Spectrophotometric Reaction Kinetics"}
                        </p>
                      </div>

                      {/* Bottom author snippet */}
                      <div className="pt-2 border-t border-slate-300/70 flex justify-between text-[8px] text-slate-500 font-mono">
                        <span>STUDENT SUBMISSION</span>
                        <span>REGISTRAR APPROVED</span>
                      </div>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tag.color}`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{tpl.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {idx === 0
                          ? "Traditional Indian & Commonwealth engineering style with departmental seals, roll numbers, and dual faculty supervisor blocks."
                          : idx === 1
                          ? "Clean, high-legibility layout for philosophy essays, literary inquiries, and Oxford/Cambridge style term papers."
                          : "Strict technical format with experiment number, bench ID, batch groups, and lead investigator signatures."}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <Link
                      href={`/create?template=${resolveTemplateSlug(tpl.id)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-crimson-brand transition-colors shadow-xs"
                    >
                      <span>Use This Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Section 3: "How It Works" Section */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-purpleLight text-accent-purple border border-accent-purpleBorder">
              <Zap className="w-3.5 h-3.5" />
              <span>STREAMLINED THREE-STEP WORKFLOW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Blank Screen to Turn-In Ready in Under a Minute
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              No manual margins, no font alignment headaches. Our automated pipeline handles the layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-crimson-brand text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  01
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  STEP ONE
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Select Template &amp; Insignia</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose from verified institutional layouts and pick a system university seal or upload
                your own department crest.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-crimson-brand flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                <span>4+ Curated System Emblems</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-accent-purple text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  02
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  STEP TWO
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Profile Autofill</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your name, registration number, course, and department populate instantly from your
                profile. Fill only assignment specifics.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-accent-purple flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Zero Duplicate Typing</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  03
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  STEP THREE
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Download Print-Ready PDF</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Compile a 300 DPI vector PDF in 0.4s via our cloud Puppeteer engine. Stored securely with
                signed download links.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
                <Download className="w-4 h-4" />
                <span>Lossless ISO 32000 Export</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to upgrade your assignment presentations?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of university students building polished, registrar-ready cover pages
            with zero formatting overhead.
          </p>
          <div className="pt-2">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-crimson-brand text-white text-sm sm:text-base font-bold hover:bg-crimson-hover shadow-lg hover:shadow-xl transition-all"
            >
              <span>Get Started Now &mdash; It&apos;s Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Section 4: Expanded Footer */}
      <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
          {/* Main Links Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Col 1: Brand Info (2 cols on md) */}
            <div className="col-span-2 space-y-4">
              <Link href="/" className="flex items-center gap-3">
                <AppLogo size="sm" />
                <span className="font-bold text-white tracking-tight text-base">
                  Student Cover Page Maker
                </span>
              </Link>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                The modern academic publishing suite for university assignments, research reports,
                and laboratory records. Built for strict registrar compliance and zero formatting friction.
              </p>
              <div className="flex items-center gap-2 pt-2 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational (ISO 32000 Ready)</span>
              </div>
            </div>

            {/* Col 2: Products */}
            <div className="space-y-3">
              <p className="font-bold uppercase tracking-wider text-slate-100 text-[11px]">
                Products
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/create" className="hover:text-white transition-colors">
                    Cover Page Maker
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="hover:text-white transition-colors">
                    Template Gallery
                  </Link>
                </li>
                <li>
                  <Link href="/preview" className="hover:text-white transition-colors">
                    Academic PDF Engine
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="hover:text-white transition-colors">
                    Institutional Crest Library
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Student Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div className="space-y-3">
              <p className="font-bold uppercase tracking-wider text-slate-100 text-[11px]">
                Resources
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    Documentation &amp; Guides
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    University Formatting Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    APA &amp; IEEE Standards
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition-colors">
                    LaTeX vs Vector PDF
                  </Link>
                </li>
                <li>
                  <Link href="/api/health/supabase" className="hover:text-white transition-colors">
                    System Health Check
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Legal & Support */}
            <div className="space-y-3">
              <p className="font-bold uppercase tracking-wider text-slate-100 text-[11px]">
                Legal &amp; Trust
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white transition-colors">
                    Cookies Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    FERPA &amp; Student Data
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-crimson-brand font-semibold hover:underline">
                    Support Desk &rarr;
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Security note */}
          <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              &copy; {new Date().getFullYear()} Student Cover Page Maker. Designed for academic
              excellence worldwide.
            </p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Row-Level Security Active</span>
              </span>
              <span>&bull;</span>
              <span>Encrypted Supabase Storage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
