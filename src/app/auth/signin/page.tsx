import React, { Suspense } from "react";
import { SignInCard } from "@/components/auth/signin-card";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 bg-white rounded-xl border border-slate-200 shadow-sm animate-pulse h-96" />
        }
      >
        <SignInCard />
      </Suspense>
    </main>
  );
}
