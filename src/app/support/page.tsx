import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { ArrowLeft, LifeBuoy, Mail, MessageSquare, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Support Desk & Academic Help — Student Cover Page Maker",
  description: "Get assistance with cover page formatting, PDF export, template requests, and technical issues.",
};

export default function SupportPage() {
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

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full space-y-10">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-crimson-50 text-crimson-brand border border-crimson-brand/20">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>ACADEMIC SUPPORT DESK</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How can we help your studies today?
          </h1>
          <p className="text-sm text-slate-600">
            Find answers to common questions about PDF generation, institutional compliance, and template customization.
          </p>
        </div>

        {/* 3 Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="academic-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-crimson-50 text-crimson-brand flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct Email Support</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reach our academic engineering team directly for bug reports or institution onboarding.
            </p>
            <a
              href="mailto:support@coverpagemaker.edu"
              className="inline-block text-xs font-semibold text-crimson-brand hover:underline pt-2"
            >
              support@coverpagemaker.edu &rarr;
            </a>
          </div>

          <div className="academic-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-accent-purpleLight text-accent-purple flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Template Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Need a specific layout for your university or department? Send us your syllabus or cover sheet guidelines.
            </p>
            <a
              href="mailto:templates@coverpagemaker.edu?subject=New%20Template%20Request"
              className="inline-block text-xs font-semibold text-accent-purple hover:underline pt-2"
            >
              Submit Guidelines &rarr;
            </a>
          </div>

          <div className="academic-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">System Status</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PDF rendering cluster and Supabase storage pipelines are actively monitored.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-medium text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems 100% Operational</span>
            </div>
          </div>
        </div>

        {/* Common FAQs */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-crimson-brand" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="space-y-3 text-sm">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">Are generated PDFs compliant with university turn-in requirements?</p>
              <p className="text-slate-600 text-xs">
                Yes. Every template follows ISO 216 standard A4 or Letter dimensions with 1.0-inch binding margins and vector-embedded typography.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">Can I upload my university&apos;s crest if it&apos;s not in the library?</p>
              <p className="text-slate-600 text-xs">
                Yes. On the editor page, click &ldquo;Upload Custom&rdquo; to upload any SVG, PNG, or JPG crest (up to 3MB). It is automatically saved to your private library.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1">
              <p className="font-bold text-slate-900">How does profile autofill work?</p>
              <p className="text-slate-600 text-xs">
                Your name, student ID, roll number, and department are stored once in your profile. Whenever you open any template, your data pre-fills instantly.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} Student Cover Page Maker. All rights reserved.</p>
      </footer>
    </div>
  );
}
