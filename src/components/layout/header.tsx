"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";

interface HeaderProps {
  studentId?: string;
  userName?: string;
}

export function Header({
  studentId = "STU-84920",
  userName = "Alex Rivera",
}: HeaderProps) {
  const { data: session } = useSession();

  const currentStudentId = session?.user?.uniqueUserId || studentId;
  const currentUserName = session?.user?.name || userName;

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-end gap-4 shrink-0">
      {/* Student ID badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-mono text-slate-700">
        <span className="text-slate-500">ID:</span>
        <span className="font-semibold text-slate-900">{currentStudentId}</span>
      </div>

      {/* User profile avatar & name */}
      <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
        <div className="w-8 h-8 rounded-full bg-crimson-100 border border-crimson-200 flex items-center justify-center text-crimson-brand font-semibold text-xs overflow-hidden">
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={currentUserName}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-4 h-4 text-crimson-brand" />
          )}
        </div>
        <span className="text-sm font-medium text-slate-800">{currentUserName}</span>

        {/* Sign out button */}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          title="Sign out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-crimson-brand hover:bg-slate-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
