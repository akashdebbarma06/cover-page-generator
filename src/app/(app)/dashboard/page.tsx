import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getUserCoverPages,
  getUserProfile,
  getAllTemplates,
} from "@/lib/supabase/queries";
import type { EnrichedCoverPageRow, TemplateRow } from "@/lib/supabase/types";
import {
  FileText,
  Plus,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Download,
  Copy,
  ExternalLink,
  Building,
  Eye,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Student Dashboard — My Cover Pages & Documents",
  description: "View and manage your generated assignment cover pages and autofill profile.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session && process.env.NODE_ENV === "production") {
    redirect("/auth/signin");
  }

  const userId = session?.user?.id || "";
  const uniqueUserId = session?.user?.uniqueUserId || "STU-84920";
  const studentName = session?.user?.name || "Alex Rivera";

  let coverPages: EnrichedCoverPageRow[] = [];
  let templates: TemplateRow[] = [];
  let profile = null;

  try {
    const supabase = createServerSupabaseClient();
    if (userId) {
      coverPages = await getUserCoverPages(supabase, userId);
      profile = await getUserProfile(supabase, userId);
    }
    templates = await getAllTemplates(supabase);
  } catch (err) {
    console.error("Dashboard data load error:", err);
  }

  const hasCoverPages = coverPages.length > 0;
  const isProfileComplete = Boolean(
    profile?.full_name && profile?.institution_name && profile?.course_details
  );

  return (
    <div className="space-y-8">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Scholastic Registry</span>
            <span>&bull;</span>
            <span className="text-crimson-brand">Academic Session 2024–2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            My Cover Pages
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage, download, and re-export your assignment cover sheets with verified university metadata.
          </p>
        </div>

        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-crimson-brand text-white rounded-xl text-sm font-semibold hover:bg-crimson-hover shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Cover Page</span>
        </Link>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="academic-card p-5 flex items-center justify-between rounded-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Generated
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{coverPages.length}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {hasCoverPages ? "Archived in Supabase Storage" : "Ready for first assignment"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-brand flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="academic-card p-5 flex items-center justify-between rounded-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Available Templates
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {templates.length > 0 ? templates.length : 3}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">ISO 216 &bull; A4 &amp; Letter Formats</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-accent-purpleLight text-accent-purple flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="academic-card p-5 flex items-center justify-between rounded-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Autofill Profile
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {isProfileComplete ? "100% Ready" : "Baseline Active"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[180px]">
              UID: {uniqueUserId} &bull; {profile?.institution_name || "Linked"}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Onboarding Notice banner if profile needs completion */}
      {!isProfileComplete && (
        <div className="bg-linear-to-r from-crimson-50 to-purple-50 border border-crimson-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-crimson-brand text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Complete your student baseline profile
              </h2>
              <p className="text-sm text-slate-600 mt-0.5">
                Welcome, {studentName}. Setting up your department, roll number, and registration numbers enables 100% automated autofill across every future assignment.
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-brand text-white text-xs font-semibold rounded-xl hover:bg-crimson-hover shrink-0 shadow-sm transition-all"
          >
            <span>Complete Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Generated Cover Pages Table / List */}
      {hasCoverPages ? (
        <div className="academic-card overflow-hidden rounded-2xl border border-slate-200">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Generated Cover Sheets</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click &ldquo;Reuse Data&rdquo; to instantly pre-fill a new document with this assignment&apos;s details.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {coverPages.length} Document{coverPages.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {coverPages.map((cp) => {
              const formData = (cp.form_data as Record<string, string>) || {};
              const title =
                formData.assignmentTitle || formData.subject || "Untitled Academic Document";
              const subtitle = formData.assignmentSubtitle || formData.subjectCode || "";
              const date = formData.submissionDate || new Date(cp.created_at).toLocaleDateString();

              return (
                <div
                  key={cp.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-brand flex items-center justify-center shrink-0 font-bold text-sm">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{title}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
                        {cp.template_name && (
                          <span className="font-medium text-slate-700">
                            {cp.template_name}
                          </span>
                        )}
                        {subtitle && <span>&bull; {subtitle}</span>}
                        <span>&bull; {date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {/* Reuse in New Cover Page */}
                    <Link
                      href={`/create?reuse=${cp.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-2xs transition-all"
                      title="Reuse this document's metadata to create a new cover page"
                    >
                      <Copy className="w-3.5 h-3.5 text-accent-purple" />
                      <span>Reuse Data</span>
                    </Link>

                    {/* Secure Download Proxy Link (never expires) */}
                    <a
                      href={`/api/pdf/download?id=${cp.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-crimson-brand text-white hover:bg-crimson-hover text-xs font-semibold shadow-xs transition-all"
                      title="Download PDF document"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>

                    {/* View in Browser */}
                    <a
                      href={`/api/pdf/download?id=${cp.id}&inline=true`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
                      title="Open PDF viewer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="academic-card p-12 text-center border-dashed border-2 border-slate-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No cover pages generated yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
            Pick an institutional format (Standard A4, Academic Minimal, or Technical Lab) to create your first standardized submission page.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-brand text-white text-xs font-semibold rounded-xl hover:bg-crimson-hover shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Generate First Cover Page</span>
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50"
            >
              <span>Browse Templates</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
