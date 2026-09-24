import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full legal name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  dob: z
    .string()
    .optional()
    .or(z.literal("")),
  institutionName: z
    .string()
    .min(2, "Institution or university name is required")
    .max(150, "Institution name cannot exceed 150 characters"),
  courseDetails: z
    .string()
    .min(2, "Course / Major details are required")
    .max(150, "Course details cannot exceed 150 characters"),
  phone: z
    .string()
    .max(30, "Phone number cannot exceed 30 characters")
    .optional()
    .or(z.literal("")),
  academicYear: z
    .string()
    .min(4, "Academic year / batch is required")
    .max(30, "Academic year cannot exceed 30 characters"),
  studentId: z.string().max(50).optional().or(z.literal("")),
  enrollmentNo: z.string().max(50).optional().or(z.literal("")),
  registrationNo: z.string().max(50).optional().or(z.literal("")),
  departmentCode: z.string().max(50).optional().or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
