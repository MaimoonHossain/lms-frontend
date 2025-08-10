// lib/validation/courseSchema.ts
import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnail: z.string().url("Invalid URL"),
  isPublished: z.boolean(), // required because defaultValues has it
});

export type CourseFormValues = z.infer<typeof courseSchema>;
