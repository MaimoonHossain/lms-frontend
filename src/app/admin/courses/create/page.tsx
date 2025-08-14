"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import Image from "next/image";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function CreateCoursePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
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
      price: 0,
      isPublished: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // temporary preview
    }
  };

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subTitle", values.subTitle ?? "");
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("level", values.level);
      formData.append("price", String(values.price));
      formData.append("isPublished", String(values.isPublished));
      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      }

      await axiosInstance.post("/course/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Course created!");
      form.reset();
      setSelectedFile(null);
      setPreviewUrl("");
      router.push("/admin/courses");
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
          <Controller
            name='description'
            control={form.control}
            render={({ field }) => (
              <JoditEditor
                value={field.value}
                config={{
                  readonly: false,
                  placeholder: "Write course description...",
                }}
                onChange={(content) => field.onChange(content)}
              />
            )}
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

        <Input
          type='number'
          step='0.01'
          placeholder='Price'
          {...form.register("price", { valueAsNumber: true })}
        />

        {/* Thumbnail Upload */}
        <div className='flex flex-col gap-3'>
          {previewUrl && (
            <Image
              src={previewUrl}
              alt='Thumbnail Preview'
              width={200}
              height={120}
              className='object-cover rounded-md'
            />
          )}
          <Input type='file' accept='image/*' onChange={handleFileChange} />
        </div>

        <Controller
          name='isPublished'
          control={form.control}
          render={({ field }) => (
            <label className='flex items-center space-x-2'>
              <input
                type='checkbox'
                name={field.name}
                ref={field.ref}
                onChange={field.onChange}
                onBlur={field.onBlur}
                checked={field.value}
              />
              <span>Publish Course</span>
            </label>
          )}
        />

        <Button type='submit' className='w-full cursor-pointer'>
          Create
        </Button>
      </form>
    </div>
  );
}
