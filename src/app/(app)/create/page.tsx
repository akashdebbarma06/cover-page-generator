import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getAllTemplates,
  getTemplateById,
  getUserProfile,
  getAvailableLogos,
  getCoverPageById,
} from "@/lib/supabase/queries";
import { mergeProfileWithSchema } from "@/lib/templates/merge";
import { CreateCoverPageContainer } from "@/components/cover-page/create-cover-page-container";
import type {
  TemplateRow,
  LogoWithSignedUrl,
  TemplateFieldSchema,
  CoverPageRow,
} from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Assignment Cover Page Generator — Cover Maker",
  description: "Generate institution-standard cover pages with dynamic template autofill.",
};

import { resolveTemplateId } from "@/lib/templates/slugs";

interface CreatePageProps {
  searchParams: {
    template?: string;
    reuse?: string;
  };
}

export default async function CreatePage({ searchParams }: CreatePageProps) {
  const session = await getServerSession(authOptions);

  if (!session && process.env.NODE_ENV === "production") {
    redirect("/auth/signin");
  }

  const userId = session?.user?.id || "";
  const platformUniqueUserId = session?.user?.uniqueUserId || "STU-84920";

  let template: TemplateRow | null = null;
  let allTemplates: TemplateRow[] = [];
  let availableLogos: LogoWithSignedUrl[] = [];
  let profile = null;
  let reusedCover: CoverPageRow | null = null;

  try {
    const supabase = createServerSupabaseClient();

    // 1. Fetch available templates
    allTemplates = await getAllTemplates(supabase);

    // If reuse specified, load previous cover page snapshot
    if (searchParams.reuse && userId) {
      reusedCover = await getCoverPageById(supabase, searchParams.reuse, userId);
      if (reusedCover && !searchParams.template && reusedCover.template_id) {
        const targetId = reusedCover.template_id;
        template = allTemplates.find((t) => t.id === targetId) || null;
      }
    }

    // If template specified in query params (slug or UUID), resolve it
    if (!template && searchParams.template) {
      const canonicalId = resolveTemplateId(searchParams.template);
      template =
        allTemplates.find((t) => t.id === canonicalId) ||
        (await getTemplateById(supabase, canonicalId));
    }

    if (!template && allTemplates.length > 0) {
      template = allTemplates[0];
    }

    // 2. Fetch user profile for autofill
    if (userId) {
      profile = await getUserProfile(supabase, userId);
    }

    // 3. Fetch logos
    availableLogos = await getAvailableLogos(supabase, userId || undefined);
  } catch (err) {
    console.error("Error loading template/profile from Supabase:", err);
  }

  // Fallback template if database query failed or unseeded
  if (!template) {
    template = {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Standard Institutional A4",
      preview_image_url: "/templates/standard-a4.png",
      created_at: new Date().toISOString(),
      field_schema: [
        {
          name: "institutionName",
          label: "Institution Name",
          type: "text",
          required: true,
          placeholder: "NATIONAL INSTITUTE OF TECHNOLOGY",
          section: "personal",
        },
        {
          name: "department",
          label: "Department Name",
          type: "text",
          required: true,
          placeholder: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
          section: "course",
        },
        {
          name: "submissionType",
          label: "Submission Type",
          type: "text",
          required: true,
          placeholder: "LAB REPORT / PRACTICAL RECORD",
          section: "assignment",
        },
        {
          name: "assignmentTitle",
          label: "Assignment Title",
          type: "text",
          required: true,
          placeholder: "Implementation & Benchmarking of Raft Consensus",
          section: "assignment",
        },
        {
          name: "subjectCode",
          label: "Subject Code",
          type: "text",
          required: true,
          placeholder: "CS-504",
          section: "course",
        },
        {
          name: "subject",
          label: "Subject Name",
          type: "text",
          required: true,
          placeholder: "Distributed Systems & Cloud Computing",
          section: "course",
        },
        {
          name: "semester",
          label: "Semester / Session",
          type: "text",
          required: true,
          placeholder: "Semester V (Autumn 2024)",
          section: "course",
        },
        {
          name: "fullName",
          label: "Student Full Name",
          type: "text",
          required: true,
          placeholder: "Alex Morgan",
          section: "personal",
        },
        {
          name: "rollNo",
          label: "Roll Number",
          type: "text",
          required: true,
          placeholder: "CS22B1044",
          section: "personal",
        },
        {
          name: "studentId",
          label: "Student ID",
          type: "text",
          required: true,
          placeholder: "STU-2022-84920",
          section: "personal",
        },
        {
          name: "facultyName",
          label: "Faculty / Instructor Name",
          type: "text",
          required: true,
          placeholder: "Dr. Evelyn Vance, Ph.D.",
          section: "faculty",
        },
        {
          name: "facultyDesignation",
          label: "Faculty Designation",
          type: "text",
          required: true,
          placeholder: "Associate Professor & Head of Lab",
          section: "faculty",
        },
        {
          name: "submissionDate",
          label: "Submission Date",
          type: "date",
          required: true,
          placeholder: "2024-11-05",
          section: "assignment",
        },
      ],
      html_template: `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>@page{size:A4;margin:25mm 20mm 20mm 20mm}body{font-family:"Times New Roman",Times,serif;color:#111;margin:0;padding:0}.header{text-align:center;border-bottom:2px solid #800020;padding-bottom:15px;margin-bottom:30px}.inst{font-size:18pt;font-weight:bold;text-transform:uppercase;color:#800020;letter-spacing:1px}.dept{font-size:12pt;text-transform:uppercase;color:#333;margin-top:5px}.sub-type{text-align:center;font-size:13pt;font-weight:bold;letter-spacing:2px;color:#555;margin-top:40px;text-transform:uppercase}.title-box{text-align:center;margin:30px 0 50px 0}.title{font-size:20pt;font-weight:bold;line-height:1.3;color:#000}.subtitle{font-size:13pt;font-style:italic;color:#444;margin-top:10px}.course-box{text-align:center;font-size:12pt;color:#333;margin-bottom:60px}.grid{display:flex;justify-content:space-between;margin-top:auto;padding-top:30px;border-top:1px solid #ccc;font-family:Arial,sans-serif;font-size:10pt}.col{width:48%}.col-right{text-align:right}.label{font-weight:bold;color:#800020;text-transform:uppercase;font-size:9pt;margin-bottom:4px}.val{margin-bottom:3px}.footer{margin-top:40px;display:flex;justify-content:space-between;font-size:9pt;font-family:Arial,sans-serif;border-top:1px dashed #999;padding-top:15px}.sig-line{width:180px;border-top:1px solid #333;margin-top:40px;padding-top:5px;text-align:center;font-size:8pt;font-weight:bold}</style></head><body><div class="header">{{logoHtml}}<div class="inst">{{institutionName}}</div><div class="dept">{{department}}</div></div><div class="sub-type">{{submissionType}}</div><div class="title-box"><div class="title">{{assignmentTitle}}</div>{{#assignmentSubtitle}}<div class="subtitle">{{assignmentSubtitle}}</div>{{/assignmentSubtitle}}</div><div class="course-box"><strong>Subject:</strong> {{subjectCode}} &mdash; {{subject}}<br><strong>Session:</strong> {{semester}}</div><div class="grid"><div class="col"><div class="label">Submitted By:</div><div class="val" style="font-size:12pt;font-weight:bold">{{fullName}}</div><div class="val"><strong>Roll No:</strong> {{rollNo}}</div><div class="val"><strong>Student ID:</strong> {{studentId}}</div>{{#registrationNo}}<div class="val"><strong>Reg No:</strong> {{registrationNo}}</div>{{/registrationNo}}</div><div class="col col-right"><div class="label">Submitted To:</div><div class="val" style="font-size:12pt;font-weight:bold">{{facultyName}}</div><div class="val">{{facultyDesignation}}</div>{{#secondFacultyName}}<div style="margin-top:10px"><div class="val" style="font-weight:bold">{{secondFacultyName}}</div><div class="val">{{secondFacultyDesignation}}</div></div>{{/secondFacultyName}}<div class="val" style="margin-top:10px"><strong>Date:</strong> {{submissionDate}}</div></div></div><div class="footer"><div class="sig-line">STUDENT SIGNATURE</div><div class="sig-line">FACULTY EVALUATION & MARKS</div></div></body></html>`,
    };
  }

  // Merge profile into template field schema, overlaid with any reused cover page values
  const fieldSchema = (template.field_schema as unknown as TemplateFieldSchema[]) || [];
  const profileDefaults = mergeProfileWithSchema(fieldSchema, profile, platformUniqueUserId);
  const reusedValues = (reusedCover?.form_data as Record<string, string>) || {};
  const initialValues = {
    ...profileDefaults,
    ...reusedValues,
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb matching architecture.pdf Page 7 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            <span>Cover Pages</span>
            <span>&gt;</span>
            <span>Create</span>
            <span>&gt;</span>
            <span className="text-crimson-brand">{template.name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Assignment Cover Page Generator
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {reusedCover
              ? "Reusing values from past submission. You can adjust any parameter before generating."
              : "Fill in the parameters below. Your profile data has been automatically loaded."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {reusedCover ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-crimson-50 text-crimson-brand border border-crimson-brand/20">
              <span className="w-2 h-2 rounded-full bg-crimson-brand" />
              Duplicating Past Page
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-purpleLight text-accent-purple border border-accent-purpleBorder">
              <span className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
              Profile Linked
            </span>
          )}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
            ISO 216 / A4
          </span>
        </div>
      </div>

      {/* Main Interactive Form & Live Sheet Preview Container */}
      <CreateCoverPageContainer
        template={template}
        initialValues={initialValues}
        availableLogos={availableLogos}
        platformUniqueUserId={platformUniqueUserId}
        initialLogoId={reusedCover?.logo_id || undefined}
        reusedTitle={reusedValues.assignmentTitle}
      />
    </div>
  );
}
