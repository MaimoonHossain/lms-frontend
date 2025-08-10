import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subTitle: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    error: "Level is required",
  }),
  thumbnail: z.string().url("Must be a valid URL"),
  isPublished: z.boolean().default(false),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
