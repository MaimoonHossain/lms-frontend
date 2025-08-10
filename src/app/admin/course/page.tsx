"use client";
import { useState } from "react";

import { CourseFormValues } from "@/lib/validation/courseSchema";
import { CourseFormModal } from "@/common/courses/CourseFormModal";
import { CourseTable } from "@/common/courses/CourseTable";
import { CourseActions } from "@/common/courses/CourseActions";

interface Course {
  title: string;
  price: string;
  status: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      title: "Mastering Docker: From Beginner to Pro",
      price: "499₹",
      status: "Published",
    },
    {
      title: "Mastering Next.js: Full-Stack Web Development",
      price: "239₹",
      status: "Published",
    },
  ]);

  const handleCreateCourse = (data: CourseFormValues) => {
    setCourses((prev) => [
      ...prev,
      {
        title: data.title,
        price: "0₹",
        status: data.isPublished ? "Published" : "Draft",
      },
    ]);
  };

  return (
    <div className='p-6'>
      <div className='mb-4 flex justify-between items-center'>
        <CourseFormModal onSubmit={handleCreateCourse} />
      </div>
      <CourseTable
        data={courses}
        columns={[
          { key: "title", header: "Title" },
          { key: "price", header: "Price" },
          {
            key: "status",
            header: "Status",
            render: (value) => (
              <span className='px-2 py-1 rounded bg-green-100 text-green-700 text-xs'>
                {value}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Action",
            render: (_, row) => (
              <CourseActions onEdit={() => alert(`Edit ${row.title}`)} />
            ),
          },
        ]}
      />
    </div>
  );
}
