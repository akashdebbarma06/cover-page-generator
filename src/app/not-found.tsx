import React from "react";
import Link from "next/link";
import { AppLogo } from "@/components/brand/app-logo";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="academic-card max-w-md w-full p-8 sm:p-10 text-center shadow-lg border border-slate-200">
        <div className="flex justify-center mb-6">
          <AppLogo size="lg" />
        </div>

        <div className="w-12 h-12 rounded-full bg-crimson-50 text-crimson-brand flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>

        <span className="text-xs font-mono font-bold text-crimson-brand uppercase tracking-wider">
          404 Error • Document Not Found
        </span>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
          Page Not Available
        </h1>

        <p className="text-sm text-slate-600 mt-2">
          The requested academic template or route does not exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-crimson-brand text-white text-sm font-semibold hover:bg-crimson-hover shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
