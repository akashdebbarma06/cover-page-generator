"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppLogo } from "@/components/brand/app-logo";
import {
  LayoutGrid,
  FilePlus,
  BookOpen,
  UserCircle,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  studentId?: string;
}

export function Sidebar({ studentId = "STU-84920" }: SidebarProps) {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutGrid,
      active: pathname === "/dashboard",
    },
    {
      name: "Create Cover Page",
      href: "/create",
      icon: FilePlus,
      active: pathname.startsWith("/create"),
    },
    {
      name: "Templates",
      href: "/templates",
      icon: BookOpen,
      active: pathname.startsWith("/templates"),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircle,
      active: pathname.startsWith("/profile"),
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between min-h-screen shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <AppLogo size="sm" />
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base">
                Cover Maker
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Academic Edition
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-medium">
                  2025
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  item.active
                    ? "bg-crimson-brand text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.active && <ChevronRight className="w-4 h-4 opacity-80" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Verified Student Badge per architecture.pdf */}
      <div className="p-4 m-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-accent-purpleLight flex items-center justify-center text-accent-purple">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-700">Verified Student</p>
            <p className="text-xs font-mono font-bold text-accent-purple tracking-wide">
              {studentId}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
