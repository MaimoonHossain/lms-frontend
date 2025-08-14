import { any, z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().optional(),
  description: z.any(),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnail: z.string(),
  isPublished: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
