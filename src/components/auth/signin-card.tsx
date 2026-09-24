"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { AppLogo } from "@/components/brand/app-logo";
import { ArrowLeft, Lock, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export function SignInCard() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleOAuthSignIn = async (provider: "google" | "github") => {
    try {
      setLoadingProvider(provider);
      await signIn(provider, { callbackUrl });
    } catch (err) {
      console.error("Sign in failed:", err);
      setLoadingProvider(null);
    }
  };

  const handleDevSignIn = async () => {
    try {
      setLoadingProvider("academic-dev");
      await signIn("academic-dev", {
        callbackUrl,
        email: "alex.rivera@harvard.edu",
        name: "Alex Rivera",
      });
    } catch (err) {
      console.error("Dev sign in failed:", err);
      setLoadingProvider(null);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Top navigation header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-crimson-brand transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Workspace
        </Link>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent-purpleLight text-accent-purple border border-accent-purpleBorder">
          ACADEMIC PORTAL
        </span>
      </div>

      {/* Main card */}
      <div className="academic-card p-8 sm:p-10 shadow-lg border border-slate-200">
        <div className="flex flex-col items-center text-center">
          <AppLogo size="lg" className="mb-6 shadow-md" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Student Cover Page Maker
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xs">
            Sign in to access your student profile, academic styles, and saved cover pages.
          </p>
        </div>

        {/* OAuth Actions */}
        <div className="mt-8 space-y-3.5">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-crimson-brand disabled:opacity-60"
          >
            {loadingProvider === "google" ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            disabled={loadingProvider !== null}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-crimson-brand disabled:opacity-60"
          >
            {loadingProvider === "github" ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-600" />
            ) : (
              <svg className="w-5 h-5 fill-current text-slate-900" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
            )}
            <span>Continue with GitHub</span>
          </button>

          {/* Quick Development Mode Student Access */}
          {process.env.NODE_ENV === "development" && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleDevSignIn}
                disabled={loadingProvider !== null}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-crimson-brand bg-crimson-50 border border-crimson-200 hover:bg-crimson-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant Sign In as Alex Rivera (Dev Mode)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Security Notice matching architecture.pdf Page 3 */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
          <div className="flex items-center justify-center text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            OAuth &amp; SAML only — passwords are never stored
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            By continuing, you acknowledge compliance with your institution&apos;s{" "}
            <span className="underline decoration-slate-300">Academic Honor Code</span> and our{" "}
            <span className="underline decoration-slate-300">Terms of Service</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
