import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { ArrowLeft, Cookie, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Cookies Policy — Student Cover Page Maker",
  description: "Information about how cookies and session storage are used in Student Cover Page Maker.",
};

export default function CookiesPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <Cookie className="w-3.5 h-3.5" />
            <span>TRANSPARENCY &amp; SESSION STATE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Cookies Policy
          </h1>
          <p className="text-sm text-slate-500">
            We use strictly essential cookies for secure authentication and session management.
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm text-slate-700 space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Essential Authentication Cookies</h2>
            <p>
              We utilize NextAuth encrypted JWT session cookies to maintain your signed-in state across requests. These cookies are strictly functional and essential for protected routes (`/create`, `/dashboard`, `/profile`).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Local &amp; Session Storage</h2>
            <p>
              When customizing templates on the `/create` page, active cover page draft parameters are saved in your browser&apos;s transient `sessionStorage` to allow real-time A4 sheet rendering without extraneous server calls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Zero Third-Party Advertising Trackers</h2>
            <p>
              We do not employ ad trackers, cross-site profiling cookies, or data broker pixels.
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
