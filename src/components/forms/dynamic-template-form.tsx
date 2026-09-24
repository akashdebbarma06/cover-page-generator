"use client";

import React from "react";
import type { TemplateFieldSchema } from "@/lib/supabase/types";
import { User, BookOpen, GraduationCap, Calendar, FileText } from "lucide-react";

interface DynamicTemplateFormProps {
  fieldSchema: TemplateFieldSchema[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export function DynamicTemplateForm({
  fieldSchema,
  values,
  onChange,
}: DynamicTemplateFormProps) {
  // Group fields by section
  const sections = {
    personal: {
      title: "Personal Information",
      icon: User,
      fields: [] as TemplateFieldSchema[],
    },
    course: {
      title: "Course Details",
      icon: BookOpen,
      fields: [] as TemplateFieldSchema[],
    },
    faculty: {
      title: "Faculty Information",
      icon: GraduationCap,
      fields: [] as TemplateFieldSchema[],
    },
    assignment: {
      title: "Assignment Details",
      icon: FileText,
      fields: [] as TemplateFieldSchema[],
    },
  };

  fieldSchema.forEach((field) => {
    const sec = field.section || inferSection(field.name);
    if (sections[sec]) {
      sections[sec].fields.push(field);
    } else {
      sections.assignment.fields.push(field);
    }
  });

  return (
    <div className="space-y-6">
      {Object.entries(sections).map(([key, section]) => {
        if (section.fields.length === 0) return null;
        const Icon = section.icon;

        return (
          <div key={key} className="academic-card p-6 md:p-7 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Icon className="w-4 h-4 text-crimson-brand" />
                <span>{section.title}</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {section.fields.length} {section.fields.length === 1 ? "field" : "fields"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === "textarea" || field.name.toLowerCase().includes("title")
                      ? "sm:col-span-2"
                      : ""
                  }
                >
                  <label
                    htmlFor={field.name}
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    {field.label}{" "}
                    {field.required && (
                      <span className="text-crimson-brand font-bold">*</span>
                    )}
                  </label>

                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      value={values[field.name] || ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      rows={3}
                      value={values[field.name] || ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                    />
                  ) : field.type === "date" ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        id={field.name}
                        type="date"
                        value={values[field.name] || ""}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        required={field.required}
                        className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                      />
                    </div>
                  ) : (
                    <input
                      id={field.name}
                      type="text"
                      value={values[field.name] || ""}
                      onChange={(e) => onChange(field.name, e.target.value)}
                      placeholder={field.placeholder || ""}
                      required={field.required}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Heuristic section inference if not explicitly provided in schema.
 */
function inferSection(name: string): "personal" | "course" | "faculty" | "assignment" {
  const lower = name.toLowerCase();
  if (
    lower.includes("name") ||
    lower.includes("roll") ||
    lower.includes("student") ||
    lower.includes("reg") ||
    lower.includes("institution") ||
    lower.includes("college")
  ) {
    if (lower.includes("faculty") || lower.includes("instructor") || lower.includes("supervisor")) {
      return "faculty";
    }
    return "personal";
  }
  if (
    lower.includes("course") ||
    lower.includes("subject") ||
    lower.includes("branch") ||
    lower.includes("dept") ||
    lower.includes("department") ||
    lower.includes("semester")
  ) {
    return "course";
  }
  if (
    lower.includes("faculty") ||
    lower.includes("instructor") ||
    lower.includes("designation") ||
    lower.includes("evaluator") ||
    lower.includes("advisor") ||
    lower.includes("supervisor")
  ) {
    return "faculty";
  }
  return "assignment";
}
