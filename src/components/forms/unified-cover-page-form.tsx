"use client";

import React from "react";
import type {
  UnifiedCoverPageData,
  FacultyMember,
  SubmissionType,
} from "@/lib/types/cover-page";
import {
  SUBMISSION_TYPES,
  COMMON_FACULTY_DESIGNATIONS,
} from "@/lib/types/cover-page";
import {
  User,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";

interface UnifiedCoverPageFormProps {
  data: UnifiedCoverPageData;
  onChange: (updated: UnifiedCoverPageData) => void;
  errors?: Record<string, string>;
}

export function UnifiedCoverPageForm({
  data,
  onChange,
  errors = {},
}: UnifiedCoverPageFormProps) {
  // 1. Personal / Student Details Handlers
  const handleStudentChange = (
    field: keyof UnifiedCoverPageData["studentDetails"],
    value: string
  ) => {
    onChange({
      ...data,
      studentDetails: {
        ...data.studentDetails,
        [field]: value,
      },
    });
  };

  // 2. Course Details Handlers
  const handleCourseChange = (
    field: keyof UnifiedCoverPageData["courseDetails"],
    value: string
  ) => {
    onChange({
      ...data,
      courseDetails: {
        ...data.courseDetails,
        [field]: value,
      },
    });
  };

  // 3. Faculty Details Handlers
  const handleFacultyMemberChange = (
    index: number,
    field: keyof FacultyMember,
    value: string
  ) => {
    const updatedFaculty = [...data.facultyDetails];
    updatedFaculty[index] = {
      ...updatedFaculty[index],
      [field]: value,
    };
    onChange({
      ...data,
      facultyDetails: updatedFaculty,
    });
  };

  const handleAddFaculty = () => {
    const newFaculty: FacultyMember = {
      id: `fac-${Date.now()}`,
      name: "",
      department: data.studentDetails.department || "",
      designation: "Assistant Professor",
    };
    onChange({
      ...data,
      facultyDetails: [...data.facultyDetails, newFaculty],
    });
  };

  const handleRemoveFaculty = (index: number) => {
    if (data.facultyDetails.length <= 1) return;
    const updated = data.facultyDetails.filter((_, i) => i !== index);
    onChange({
      ...data,
      facultyDetails: updated,
    });
  };

  // 4. Submission Details Handlers
  const handleSubmissionChange = (
    field: keyof UnifiedCoverPageData["submissionDetails"],
    value: string
  ) => {
    onChange({
      ...data,
      submissionDetails: {
        ...data.submissionDetails,
        [field]: value,
      },
    });
  };

  // 5. Additional Details Handlers
  const handleAdditionalChange = (
    field: keyof UnifiedCoverPageData["additionalDetails"],
    value: string
  ) => {
    onChange({
      ...data,
      additionalDetails: {
        ...data.additionalDetails,
        [field]: value,
      },
    });
  };

  const subType = data.submissionDetails.submissionType as SubmissionType;

  return (
    <div className="space-y-6">
      {/* 1. PERSONAL / STUDENT DETAILS */}
      <div className="academic-card p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-crimson-brand" />
            <span>Personal &amp; Student Details</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Section 1 of 5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="student-fullName"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Full Legal Name <span className="text-crimson-brand font-bold">*</span>
            </label>
            <input
              id="student-fullName"
              type="text"
              value={data.studentDetails.fullName}
              onChange={(e) => handleStudentChange("fullName", e.target.value)}
              placeholder="e.g. Alex Morgan"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                errors["studentDetails.fullName"]
                  ? "border-red-400 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />
            {errors["studentDetails.fullName"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["studentDetails.fullName"]}
              </p>
            )}
          </div>

          {/* Institution Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="student-institutionName"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Institution / University Name{" "}
              <span className="text-crimson-brand font-bold">*</span>
            </label>
            <input
              id="student-institutionName"
              type="text"
              value={data.studentDetails.institutionName}
              onChange={(e) =>
                handleStudentChange("institutionName", e.target.value)
              }
              placeholder="e.g. NATIONAL INSTITUTE OF TECHNOLOGY"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                errors["studentDetails.institutionName"]
                  ? "border-red-400 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />
            {errors["studentDetails.institutionName"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["studentDetails.institutionName"]}
              </p>
            )}
          </div>

          {/* Student ID / Roll No. */}
          <div>
            <label
              htmlFor="student-studentId"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Student ID / Roll No.{" "}
              <span className="text-crimson-brand font-bold">*</span>
            </label>
            <input
              id="student-studentId"
              type="text"
              value={data.studentDetails.studentId}
              onChange={(e) => handleStudentChange("studentId", e.target.value)}
              placeholder="e.g. CS22B1044 or 2024-STU-882"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                errors["studentDetails.studentId"]
                  ? "border-red-400 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />
            {errors["studentDetails.studentId"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["studentDetails.studentId"]}
              </p>
            )}
          </div>

          {/* Class / Semester */}
          <div>
            <label
              htmlFor="student-classSemester"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Class / Semester / Batch{" "}
              <span className="text-crimson-brand font-bold">*</span>
            </label>
            <input
              id="student-classSemester"
              type="text"
              value={data.studentDetails.classSemester}
              onChange={(e) =>
                handleStudentChange("classSemester", e.target.value)
              }
              placeholder="e.g. Semester V (Autumn 2024) or Year 3"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                errors["studentDetails.classSemester"]
                  ? "border-red-400 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />
            {errors["studentDetails.classSemester"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["studentDetails.classSemester"]}
              </p>
            )}
          </div>

          {/* Department / Branch */}
          <div>
            <label
              htmlFor="student-department"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Department / Branch <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="student-department"
              type="text"
              value={data.studentDetails.department || ""}
              onChange={(e) => handleStudentChange("department", e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>

          {/* Enrollment ID */}
          <div>
            <label
              htmlFor="student-enrollmentId"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Enrollment ID <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="student-enrollmentId"
              type="text"
              value={data.studentDetails.enrollmentId || ""}
              onChange={(e) =>
                handleStudentChange("enrollmentId", e.target.value)
              }
              placeholder="e.g. ENR-2022-8812"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>

          {/* Registration No */}
          <div className="sm:col-span-2">
            <label
              htmlFor="student-registrationNo"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Registration No. <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="student-registrationNo"
              type="text"
              value={data.studentDetails.registrationNo || ""}
              onChange={(e) =>
                handleStudentChange("registrationNo", e.target.value)
              }
              placeholder="e.g. REG-8829104"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>
      </div>

      {/* 2. COURSE DETAILS */}
      <div className="academic-card p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-crimson-brand" />
            <span>Course Details</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Section 2 of 5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Course Name */}
          <div className="sm:col-span-2">
            <label
              htmlFor="course-courseName"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Course / Subject Name <span className="text-crimson-brand font-bold">*</span>
            </label>
            <input
              id="course-courseName"
              type="text"
              value={data.courseDetails.courseName}
              onChange={(e) => handleCourseChange("courseName", e.target.value)}
              placeholder="e.g. Distributed Systems & Cloud Computing"
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                errors["courseDetails.courseName"]
                  ? "border-red-400 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />
            {errors["courseDetails.courseName"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["courseDetails.courseName"]}
              </p>
            )}
          </div>

          {/* Course Code */}
          <div className="sm:col-span-2">
            <label
              htmlFor="course-courseCode"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Course Code <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="course-courseCode"
              type="text"
              value={data.courseDetails.courseCode || ""}
              onChange={(e) => handleCourseChange("courseCode", e.target.value)}
              placeholder="e.g. CS-504"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>
      </div>

      {/* 3. FACULTY DETAILS (MULTIPLE ENTRIES) */}
      <div className="academic-card p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-crimson-brand" />
            <h3 className="text-sm font-bold text-slate-900">Faculty &amp; Evaluator Details</h3>
          </div>
          <button
            type="button"
            onClick={handleAddFaculty}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-crimson-50 text-crimson-brand hover:bg-crimson-100 transition-colors border border-crimson-brand/20 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Faculty</span>
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Specify your supervising professor, instructor, or lab evaluator. You can add co-evaluators or project mentors.
        </p>

        <div className="space-y-4">
          {data.facultyDetails.map((faculty, idx) => (
            <div
              key={faculty.id}
              className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-crimson-brand" />
                  {idx === 0 ? "Primary Instructor / Evaluator *" : `Co-Faculty / Mentor #${idx + 1}`}
                </span>

                {idx > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFaculty(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                    title="Remove this faculty entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Faculty Name */}
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Faculty Full Name {idx === 0 && <span className="text-crimson-brand">*</span>}
                  </label>
                  <input
                    type="text"
                    value={faculty.name}
                    onChange={(e) =>
                      handleFacultyMemberChange(idx, "name", e.target.value)
                    }
                    placeholder="e.g. Dr. Evelyn Vance, Ph.D."
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                      idx === 0 && errors["facultyDetails.0.name"]
                        ? "border-red-400 bg-red-50/20"
                        : "border-slate-300"
                    }`}
                  />
                  {idx === 0 && errors["facultyDetails.0.name"] && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors["facultyDetails.0.name"]}
                    </p>
                  )}
                </div>

                {/* Faculty Designation */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    value={faculty.designation || ""}
                    onChange={(e) =>
                      handleFacultyMemberChange(idx, "designation", e.target.value)
                    }
                    list={`designations-${idx}`}
                    placeholder="e.g. Associate Professor & Head of Lab"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                  />
                  <datalist id={`designations-${idx}`}>
                    {COMMON_FACULTY_DESIGNATIONS.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>

                {/* Faculty Department */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Department <span className="text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={faculty.department || ""}
                    onChange={(e) =>
                      handleFacultyMemberChange(idx, "department", e.target.value)
                    }
                    placeholder="e.g. Dept of CS"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SUBMISSION DETAILS */}
      <div className="academic-card p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-crimson-brand" />
            <span>Submission Details</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-400">Section 4 of 5</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Submission Type Dropdown */}
          <div>
            <label
              htmlFor="submission-type"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Submission Type <span className="text-crimson-brand font-bold">*</span>
            </label>
            <select
              id="submission-type"
              value={data.submissionDetails.submissionType}
              onChange={(e) => handleSubmissionChange("submissionType", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all font-medium"
            >
              {SUBMISSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Session */}
          <div>
            <label
              htmlFor="submission-session"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Academic Session / Year
            </label>
            <input
              id="submission-session"
              type="text"
              value={data.submissionDetails.session || ""}
              onChange={(e) => handleSubmissionChange("session", e.target.value)}
              placeholder="e.g. 2024–2025"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>

          {/* Submission Date Calendar Picker */}
          <div>
            <label
              htmlFor="submission-date"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Submission Date <span className="text-crimson-brand font-bold">*</span>
            </label>
            <div className="relative">
              <input
                id="submission-date"
                type="date"
                value={data.submissionDetails.submissionDate}
                onChange={(e) =>
                  handleSubmissionChange("submissionDate", e.target.value)
                }
                className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                  errors["submissionDetails.submissionDate"]
                    ? "border-red-400 bg-red-50/20"
                    : "border-slate-300"
                }`}
              />
            </div>
            {errors["submissionDetails.submissionDate"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["submissionDetails.submissionDate"]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 5. ADDITIONAL & CONDITIONAL DETAILS */}
      <div className="academic-card p-6 md:p-7 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-crimson-brand" />
            <h3 className="text-sm font-bold text-slate-900">
              Additional Details &bull; {subType}
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-crimson-50 text-crimson-brand border border-crimson-brand/20">
            Dynamic for {subType}
          </span>
        </div>

        {/* Dynamic Context Banner */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-crimson-brand shrink-0" />
          <span>
            These fields are tailored for <strong>{subType}</strong> submissions and automatically populate the corresponding title blocks on your cover sheet.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Main Title (Required for all submission types) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="additional-title"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              {subType === "Lab Report" || subType === "Practical Record"
                ? "Experiment / Practical Title"
                : subType === "Term Paper" || subType === "Essay"
                ? "Paper / Essay Title"
                : subType === "Project Report" || subType === "Dissertation / Thesis"
                ? "Project / Thesis Title"
                : "Assignment Title"}{" "}
              <span className="text-crimson-brand font-bold">*</span>
            </label>
            <input
              id="additional-title"
              type="text"
              value={data.additionalDetails.assignmentTitle || ""}
              onChange={(e) =>
                handleAdditionalChange("assignmentTitle", e.target.value)
              }
              placeholder={
                subType === "Lab Report"
                  ? "e.g. Implementation & Benchmarking of Raft Consensus in Distributed Environments"
                  : subType === "Essay"
                  ? "e.g. Rethinking Epistemic Authority in Networked Democracies"
                  : "e.g. Advanced Neural Architectures for Multimodal Representation"
              }
              className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all ${
                errors["additionalDetails.assignmentTitle"]
                  ? "border-red-400 bg-red-50/20"
                  : "border-slate-300"
              }`}
            />
            {errors["additionalDetails.assignmentTitle"] && (
              <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors["additionalDetails.assignmentTitle"]}
              </p>
            )}
          </div>

          {/* Subtitle / Topic Description */}
          <div className="sm:col-span-2">
            <label
              htmlFor="additional-subtitle"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Subtitle / Topic Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              id="additional-subtitle"
              type="text"
              value={data.additionalDetails.assignmentSubtitle || ""}
              onChange={(e) =>
                handleAdditionalChange("assignmentSubtitle", e.target.value)
              }
              placeholder="e.g. Practical Laboratory Session 04 - High-Availability Clusters"
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>

          {/* Conditional Lab Report Fields */}
          {(subType === "Lab Report" || subType === "Practical Record") && (
            <>
              <div>
                <label
                  htmlFor="additional-experimentNo"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Experiment Number
                </label>
                <input
                  id="additional-experimentNo"
                  type="text"
                  value={data.additionalDetails.experimentNo || ""}
                  onChange={(e) =>
                    handleAdditionalChange("experimentNo", e.target.value)
                  }
                  placeholder="e.g. EXP-04"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="additional-benchNo"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Bench / Workstation ID
                </label>
                <input
                  id="additional-benchNo"
                  type="text"
                  value={data.additionalDetails.benchNo || ""}
                  onChange={(e) =>
                    handleAdditionalChange("benchNo", e.target.value)
                  }
                  placeholder="e.g. Station #12"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="additional-batchGroup"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Lab Batch / Group Code
                </label>
                <input
                  id="additional-batchGroup"
                  type="text"
                  value={data.additionalDetails.batchGroup || ""}
                  onChange={(e) =>
                    handleAdditionalChange("batchGroup", e.target.value)
                  }
                  placeholder="e.g. Batch B2 - Friday Session"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
                />
              </div>
            </>
          )}

          {/* Conditional Due Date (Optional calendar picker for assignments/papers/theses) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="additional-dueDate"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Assignment / Paper Due Date <span className="text-slate-400 font-normal">(Optional deadline tracker)</span>
            </label>
            <input
              id="additional-dueDate"
              type="date"
              value={data.additionalDetails.dueDate || ""}
              onChange={(e) => handleAdditionalChange("dueDate", e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-crimson-brand/20 focus:border-crimson-brand transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
