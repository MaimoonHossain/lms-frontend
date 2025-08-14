"use client";

import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Image from "next/image";

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

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function EditCoursePage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      price: 0,
      isPublished: false,
    },
  });

  useEffect(() => {
    async function fetchCourse() {
      try {
        const res = await axiosInstance.get(`course/get-course-by-id/${id}`);
        const data: CourseFormValues = res.data;

        form.reset({
          title: data.title,
          subTitle: data.subTitle ?? "",
          category: data.category,
          level: data.level,
          thumbnail: data.thumbnail,
          price: data.price ?? 0,
          isPublished: data.isPublished ?? false,
          description: "", // leave blank; handled separately
        });

        setDescription(data.description || "");
        setPreviewUrl(data.thumbnail as string); // show current thumbnail
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values: CourseFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("subTitle", values.subTitle ?? "");
      formData.append("description", description);
      formData.append("category", values.category);
      formData.append("level", values.level);
      formData.append("price", String(values.price));
      formData.append("isPublished", String(values.isPublished));

      if (selectedFile) {
        formData.append("thumbnail", selectedFile);
      } else if (typeof values.thumbnail === "string") {
        formData.append("thumbnailUrl", values.thumbnail); // keep old thumbnail
      }

      await axiosInstance.patch(`course/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
          Update
        </Button>
      </form>
    </div>
  );
}
