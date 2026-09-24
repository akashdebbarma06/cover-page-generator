export interface FacultyMember {
  id: string;
  name: string;
  department?: string;
  designation?: string;
}

export interface StudentDetails {
  fullName: string;
  institutionName: string;
  studentId: string;
  enrollmentId?: string;
  registrationNo?: string;
  department?: string;
  classSemester: string;
}

export interface CourseDetails {
  courseName: string;
  courseCode?: string;
}

export interface SubmissionDetails {
  submissionType: string;
  session?: string;
  submissionDate: string;
}

export interface AdditionalDetails {
  assignmentTitle?: string;
  assignmentSubtitle?: string;
  paperName?: string;
  essayTitle?: string;
  dueDate?: string;
  experimentNo?: string;
  benchNo?: string;
  batchGroup?: string;
  [key: string]: string | undefined;
}

export interface UnifiedCoverPageData {
  studentDetails: StudentDetails;
  courseDetails: CourseDetails;
  facultyDetails: FacultyMember[];
  submissionDetails: SubmissionDetails;
  additionalDetails: AdditionalDetails;
}

export const SUBMISSION_TYPES = [
  "Assignment",
  "Lab Report",
  "Project Report",
  "Term Paper",
  "Essay",
  "Dissertation / Thesis",
  "Practical Record",
  "Seminar Presentation",
] as const;

export type SubmissionType = (typeof SUBMISSION_TYPES)[number];

export const COMMON_FACULTY_DESIGNATIONS = [
  "Professor & Head of Department",
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Senior Lecturer",
  "Lecturer",
  "Lab Instructor / Technical Officer",
  "Teaching Assistant",
  "Research Supervisor",
] as const;

/**
 * Initializes a structured UnifiedCoverPageData object from incoming flat key-value pairs
 * (from profile merge, reused cover page, or database template schema).
 */
export function initialValuesToUnifiedData(
  initial: Record<string, string>
): UnifiedCoverPageData {
  const today = new Date().toISOString().split("T")[0];

  // Faculty extraction
  const facultyList: FacultyMember[] = [];
  const primaryFacultyName = initial.facultyName || "";
  if (primaryFacultyName || initial.facultyDesignation || initial.facultyDepartment) {
    facultyList.push({
      id: "fac-1",
      name: primaryFacultyName,
      department: initial.facultyDepartment || initial.department || "",
      designation: initial.facultyDesignation || "Assistant Professor",
    });
  } else {
    facultyList.push({
      id: "fac-1",
      name: "",
      department: "",
      designation: "Assistant Professor",
    });
  }

  if (initial.secondFacultyName) {
    facultyList.push({
      id: "fac-2",
      name: initial.secondFacultyName,
      department: initial.secondFacultyDepartment || "",
      designation: initial.secondFacultyDesignation || "Assistant Professor",
    });
  }

  // Submission type detection
  let subType = initial.submissionType || "Assignment";
  const lowerSub = subType.toLowerCase();
  if (lowerSub.includes("lab") || lowerSub.includes("practical") || initial.experimentNo) {
    subType = "Lab Report";
  } else if (lowerSub.includes("project") || lowerSub.includes("capstone")) {
    subType = "Project Report";
  } else if (lowerSub.includes("paper")) {
    subType = "Term Paper";
  } else if (lowerSub.includes("essay")) {
    subType = "Essay";
  } else if (lowerSub.includes("thesis") || lowerSub.includes("dissertation")) {
    subType = "Dissertation / Thesis";
  }

  return {
    studentDetails: {
      fullName: initial.fullName || initial.studentName || "",
      institutionName: initial.institutionName || initial.institution || "",
      studentId: initial.studentId || initial.rollNo || "",
      enrollmentId: initial.enrollmentId || initial.enrollmentNo || "",
      registrationNo: initial.registrationNo || "",
      department: initial.department || initial.departmentCode || initial.branch || "",
      classSemester: initial.classSemester || initial.semester || initial.academicYear || "",
    },
    courseDetails: {
      courseName: initial.courseName || initial.subject || "",
      courseCode: initial.courseCode || initial.subjectCode || "",
    },
    facultyDetails: facultyList,
    submissionDetails: {
      submissionType: subType,
      session: initial.session || initial.semester || initial.academicYear || "2024–2025",
      submissionDate: initial.submissionDate || today,
    },
    additionalDetails: {
      assignmentTitle:
        initial.assignmentTitle ||
        initial.paperName ||
        initial.essayTitle ||
        "",
      assignmentSubtitle: initial.assignmentSubtitle || "",
      paperName: initial.paperName || initial.assignmentTitle || "",
      essayTitle: initial.essayTitle || initial.assignmentTitle || "",
      dueDate: initial.dueDate || "",
      experimentNo: initial.experimentNo || "",
      benchNo: initial.benchNo || "",
      batchGroup: initial.batchGroup || "",
    },
  };
}

/**
 * Transforms unified structured data into a rich flat map compatible with all template placeholders.
 * Generates both direct variable tokens and responsive multi-faculty HTML snippets.
 */
export function unifiedDataToFlatValues(
  data: UnifiedCoverPageData
): Record<string, string> {
  const flat: Record<string, string> = {};

  // Student Details
  flat.fullName = data.studentDetails.fullName;
  flat.studentName = data.studentDetails.fullName;
  flat.institutionName = data.studentDetails.institutionName;
  flat.institution = data.studentDetails.institutionName;
  flat.studentId = data.studentDetails.studentId;
  flat.rollNo = data.studentDetails.studentId;
  flat.id = data.studentDetails.studentId;
  flat.enrollmentId = data.studentDetails.enrollmentId || "";
  flat.enrollmentNo = data.studentDetails.enrollmentId || "";
  flat.registrationNo = data.studentDetails.registrationNo || "";
  flat.department = data.studentDetails.department || "";
  flat.departmentCode = data.studentDetails.department || "";
  flat.branch = data.studentDetails.department || "";
  flat.classSemester = data.studentDetails.classSemester;
  flat.semester = data.studentDetails.classSemester;

  // Course Details
  flat.courseName = data.courseDetails.courseName;
  flat.subject = data.courseDetails.courseName;
  flat.courseCode = data.courseDetails.courseCode || "";
  flat.subjectCode = data.courseDetails.courseCode || "";

  // Submission Details
  flat.submissionType = data.submissionDetails.submissionType;
  flat.session = data.submissionDetails.session || "";
  flat.submissionDate = data.submissionDetails.submissionDate;

  // Additional / Conditional Details
  const title =
    data.additionalDetails.assignmentTitle ||
    data.additionalDetails.paperName ||
    data.additionalDetails.essayTitle ||
    "";
  flat.assignmentTitle = title;
  flat.assignmentSubtitle = data.additionalDetails.assignmentSubtitle || "";
  flat.paperName = data.additionalDetails.paperName || title;
  flat.essayTitle = data.additionalDetails.essayTitle || title;
  flat.dueDate = data.additionalDetails.dueDate || "";
  flat.experimentNo = data.additionalDetails.experimentNo || "";
  flat.benchNo = data.additionalDetails.benchNo || "";
  flat.batchGroup = data.additionalDetails.batchGroup || "";

  // Faculty Details mapping
  if (data.facultyDetails.length > 0) {
    const f1 = data.facultyDetails[0];
    flat.facultyName = f1.name;
    flat.facultyDesignation = f1.designation || "";
    flat.facultyDepartment = f1.department || "";
  } else {
    flat.facultyName = "";
    flat.facultyDesignation = "";
    flat.facultyDepartment = "";
  }

  if (data.facultyDetails.length > 1) {
    const f2 = data.facultyDetails[1];
    flat.secondFacultyName = f2.name;
    flat.secondFacultyDesignation = f2.designation || "";
    flat.secondFacultyDepartment = f2.department || "";
  } else {
    flat.secondFacultyName = "";
    flat.secondFacultyDesignation = "";
    flat.secondFacultyDepartment = "";
  }

  // Generate responsive multi-faculty roster markup for advanced templates
  flat.facultyHtml = data.facultyDetails
    .filter((f) => f.name.trim().length > 0)
    .map(
      (f, idx) => `
      <div class="faculty-item" style="margin-top:${idx === 0 ? "0" : "10px"};">
        <div class="val" style="font-size:12pt;font-weight:bold;">${f.name}</div>
        <div class="val" style="font-size:10pt;color:#444;">${f.designation || ""}${
        f.department ? ` &bull; ${f.department}` : ""
      }</div>
      </div>`
    )
    .join("");

  return flat;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates required fields according to academic formatting standards.
 */
export function validateUnifiedCoverPageData(
  data: UnifiedCoverPageData
): ValidationResult {
  const errors: Record<string, string> = {};

  // Personal / Student Details Validation
  if (!data.studentDetails.fullName.trim()) {
    errors["studentDetails.fullName"] = "Student full name is required.";
  }
  if (!data.studentDetails.institutionName.trim()) {
    errors["studentDetails.institutionName"] = "Institution name is required.";
  }
  if (!data.studentDetails.studentId.trim()) {
    errors["studentDetails.studentId"] = "Student ID or Roll Number is required.";
  }
  if (!data.studentDetails.classSemester.trim()) {
    errors["studentDetails.classSemester"] = "Class, Semester, or Batch is required.";
  }

  // Course Details Validation
  if (!data.courseDetails.courseName.trim()) {
    errors["courseDetails.courseName"] = "Course / Subject name is required.";
  }

  // Faculty Details Validation
  const primaryFaculty = data.facultyDetails[0];
  if (!primaryFaculty || !primaryFaculty.name.trim()) {
    errors["facultyDetails.0.name"] = "Primary Faculty or Instructor name is required.";
  }

  // Submission Details Validation
  if (!data.submissionDetails.submissionType.trim()) {
    errors["submissionDetails.submissionType"] = "Submission type is required.";
  }
  if (!data.submissionDetails.submissionDate.trim()) {
    errors["submissionDetails.submissionDate"] = "Submission date is required.";
  }

  // Additional Title Validation (Required for all academic submissions)
  const title =
    data.additionalDetails.assignmentTitle ||
    data.additionalDetails.paperName ||
    data.additionalDetails.essayTitle ||
    "";
  if (!title.trim()) {
    errors["additionalDetails.assignmentTitle"] =
      "Title is required (e.g. Assignment Title, Paper Name, or Experiment Title).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
