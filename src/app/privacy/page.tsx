import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — Student Cover Page Maker",
  description: "Our commitment to student privacy, data protection, and FERPA compliance.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <AppLogo size="sm" />
            <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
              Student Cover Page Maker
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-crimson-brand transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Shield className="w-3.5 h-3.5" />
            <span>STUDENT PRIVACY COMMITMENT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy &amp; Data Protection
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: September 2026 &bull; Strict adherence to student data protection standards.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-crimson-brand" />
              <span>1. Information We Collect</span>
            </h2>
            <p>
              We collect only the minimal academic data required to format and generate your assignment cover sheets:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li><strong>Account Identity:</strong> Your authenticated name and email from Google or GitHub OAuth.</li>
              <li><strong>Academic Profile:</strong> Institution name, course details, roll number, and department fields you supply.</li>
              <li><strong>Document Assets:</strong> Custom logos and generated PDF outputs archived securely in private storage buckets.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-crimson-brand" />
              <span>2. How Your Data Is Used</span>
            </h2>
            <p>
              Your student data is strictly utilized to populate cover page templates and compile PDFs. We never sell, monetize, or license student records to third parties or advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>3. Cloud Storage &amp; Encryption</span>
            </h2>
            <p>
              All assets (logos and generated PDFs) are stored in private Supabase Storage buckets protected by Row-Level Security (RLS) policies. Files are accessible only via cryptographically signed, time-limited URLs (1-hour validity).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Data Deletion &amp; Export</h2>
            <p>
              You maintain total control over your academic records. You can update or delete your profile and custom logo files at any time directly through your dashboard.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Student Cover Page Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
