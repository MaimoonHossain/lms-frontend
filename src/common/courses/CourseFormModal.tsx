"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface Props {
  onSuccess?: () => void;
}

export const CourseFormModal: React.FC<Props> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);

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

  const handleSubmit: (values: CourseFormValues) => Promise<void> = async (
    values
  ) => {
    try {
      await axiosInstance.post("/course/create", values);
      toast.success("Course created!");
      form.reset();
      setOpen(false); // ✅ close modal
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create course");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Course</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
          <Input placeholder='Title' {...form.register("title")} />
          <Input placeholder='Subtitle' {...form.register("subTitle")} />
          <Textarea
            placeholder='Description'
            {...form.register("description")}
          />
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
          <Button type='submit' className='w-full'>
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
