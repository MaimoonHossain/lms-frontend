"use client";

import { useState, useEffect } from "react";

import { CourseFormValues } from "@/lib/validation/courseSchema";
import { CourseFormModal } from "@/common/courses/CourseFormModal";
import { CourseTable } from "@/common/courses/CourseTable";
import { CourseActions } from "@/common/courses/CourseActions";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  price?: string;
  status: string;
  isPublished?: boolean; // Optional, depending on your backend model
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await axiosInstance.get("/course");
        const data = res.data;

        // Map courses from backend to frontend format
        const mappedCourses = data?.map((course: Course) => ({
          _id: course._id,
          title: course.title,
          price: "Free", // Adjust or add price field to your model/backend if needed
          status: course.status ?? (course.isPublished ? "Published" : "Draft"),
        }));

        setCourses(mappedCourses);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const handleCreateCourse = (data: CourseFormValues) => {
    setCourses((prev) => [
      ...prev,
      {
        _id: Date.now().toString(), // Temporary id, replace with backend id after creation
        title: data.title,
        price: "0₹",
        status: data.isPublished ? "Published" : "Draft",
      },
    ]);
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className='text-red-600'>Error: {error}</p>;
  if (!courses || courses.length === 0) return <p>No courses found.</p>;

  return (
    <div className='p-6'>
      <Link
        href='/admin/courses/create'
        className='mb-4 inline-flex items-center justify-center rounded-md bg-gray-950 px-4 py-2 text-white font-medium hover:bg-gray-700 transition-colors'
      >
        Create New Course
      </Link>
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
              // <CourseActions onEdit={() => alert(`Edit ${row.title}`)} />
              <Link
                href={`/admin/courses/edit/${row._id}`}
                className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'
              >
                Edit
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
