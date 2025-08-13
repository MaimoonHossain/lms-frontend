"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseSchema, CourseFormValues } from "@/lib/validation/courseSchema";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function CreateCoursePage() {
  const [description, setDescription] = useState("");
  const router = useRouter();

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      subTitle: "",
      description: "",
      category: "",
      level: "beginner",
      thumbnail: "",
      isPublished: false,
    },
  });

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      await axiosInstance.post("/course/create", {
        ...values,
        description, // Use rich text value
      });
      toast.success("Course created!");
      form.reset();
      setDescription("");
      router.push("/admin/courses"); // Redirect to courses page
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <div className='max-w-3xl mx-auto py-8'>
      <h1 className='text-2xl font-semibold mb-6'>Create New Course</h1>

      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <Input placeholder='Title' {...form.register("title")} />
        <Input placeholder='Subtitle' {...form.register("subTitle")} />

        {/* Rich Text Editor for Description */}
        <div>
          <label className='block mb-2 font-medium'>Description</label>
          <JoditEditor
            value={description}
            config={{
              readonly: false, // Allow editing
              placeholder: "Write course description...",
            }}
            onChange={setDescription}
          />
        </div>

        <Input placeholder='Category' {...form.register("category")} />

        <Select
          defaultValue='beginner'
          onValueChange={(val) =>
            form.setValue("level", val as CourseFormValues["level"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder='Select Level' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='beginner'>Beginner</SelectItem>
            <SelectItem value='intermediate'>Intermediate</SelectItem>
            <SelectItem value='advanced'>Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder='Thumbnail URL' {...form.register("thumbnail")} />

        <Button type='submit' className='w-full cursor-pointer'>
          Create
        </Button>
      </form>
    </div>
  );
}
