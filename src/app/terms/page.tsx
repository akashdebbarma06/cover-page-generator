import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { ArrowLeft, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Terms and Conditions — Student Cover Page Maker",
  description: "Terms of service and institutional usage guidelines for Student Cover Page Maker.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
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

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-8">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-accent-purpleLight text-accent-purple border border-accent-purpleBorder">
            <FileText className="w-3.5 h-3.5" />
            <span>ACADEMIC TERMS OF SERVICE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-slate-500">
            Last updated: September 2026 &bull; Fair use and institutional integrity guidelines.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Educational Fair Use</h2>
            <p>
              Student Cover Page Maker is created to assist students, researchers, and instructors with formatting assignment cover pages, laboratory records, and technical reports in compliance with university standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Academic Honesty &amp; Identity</h2>
            <p>
              Users agree to provide accurate student credentials (name, student ID, roll number, and department) and not misrepresent affiliation with any institution or faculty advisor.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Institutional Crests &amp; Trademarks</h2>
            <p>
              System crests and institutional logos provided in our library are displayed for identification and educational attribution. Custom logos uploaded by users must not violate copyright or intellectual property rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Availability &amp; Export Fidelity</h2>
            <p>
              We strive for 99.9% uptime and calibrate PDF generation to ISO 32000 specifications. Users are encouraged to inspect live sheet previews before submitting critical assignments.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Student Cover Page Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
