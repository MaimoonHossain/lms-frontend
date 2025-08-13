"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

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
import axiosInstance from "@/lib/axiosInstance";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function EditCoursePage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

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

  // Fetch course details
  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axiosInstance.get(`course/get-course-by-id/${id}`);
        const data: CourseFormValues = res.data;

        // Set react-hook-form values
        form.reset({
          title: data.title,
          subTitle: data.subTitle ?? "",
          category: data.category,
          level: data.level,
          thumbnail: data.thumbnail,
          isPublished: data.isPublished ?? false,
          description: "", // leave blank because we'll handle it separately
        });

        setDescription(data.description || "");
        setError(null);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Failed to fetch course details"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id]);

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      await axiosInstance.patch(`course/edit/${id}`, {
        ...values,
        description, // send rich text
      });
      toast.success("Course updated!");
      router.push("/admin/courses");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update course");
    }
  };

  if (loading) return <p>Loading course details...</p>;
  if (error) return <p className='text-red-600'>{error}</p>;

  return (
    <div className='max-w-3xl mx-auto py-8'>
      <h1 className='text-2xl font-semibold mb-6'>Edit Course</h1>

      <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
        <Input placeholder='Title' {...form.register("title")} />
        <Input placeholder='Subtitle' {...form.register("subTitle")} />

        {/* Rich Text Editor for Description */}
        <div>
          <label className='block mb-2 font-medium'>Description</label>
          <JoditEditor
            value={description}
            config={{
              readonly: false,
              placeholder: "Write course description...",
            }}
            onChange={setDescription}
          />
        </div>

        <Input placeholder='Category' {...form.register("category")} />

        <Select
          defaultValue={form.getValues("level")}
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

        <div className='flex items-center space-x-4'>
          <label className='flex items-center space-x-2'>
            <input
              type='checkbox'
              checked={form.getValues("isPublished")}
              onChange={(e) => form.setValue("isPublished", e.target.checked)}
            />
            <span>Publish Course</span>
          </label>
        </div>

        <Button type='submit' className='w-full cursor-pointer'>
          Update
        </Button>
      </form>
    </div>
  );
}
