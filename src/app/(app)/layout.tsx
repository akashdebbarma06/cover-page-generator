import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Fallback check in addition to middleware
  if (!session && process.env.NODE_ENV === "production") {
    redirect("/auth/signin");
  }

  const studentId = session?.user?.uniqueUserId || "STU-84920";
  const userName = session?.user?.name || "Alex Rivera";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar studentId={studentId} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header studentId={studentId} userName={userName} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
