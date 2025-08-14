"use client";

import { useEffect, useState } from "react";
import { CourseTable } from "@/common/courses/CourseTable";
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  price?: string;
  status: string;
  isPublished?: boolean;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await axiosInstance.get("/course");
      const data = res.data;

      const mappedCourses = data?.map((course: Course) => ({
        _id: course._id,
        title: course.title,
        price: "Free", // adjust as needed
        status: course.status ?? (course.isPublished ? "Published" : "Draft"),
      }));

      setCourses(mappedCourses);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

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
              <span
                className={`${
                  value === "Published"
                    ? "px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
                    : "px-2 py-1 rounded bg-red-100 text-red-700 text-xs"
                }`}
              >
                {value}
              </span>
            ),
          },
          {
            key: "actions",
            header: "Action",
            render: (_, row) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='p-1 rounded hover:bg-gray-200'>
                    <MoreVertical size={18} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem>
                    <Link href={`/admin/courses/${row._id}`}>
                      Course Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={`/admin/courses/edit/${row._id}`}>Edit</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      // Add delete logic here
                      alert(`Delete course: ${row.title}`);
                    }}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
          },
        ]}
      />
    </div>
  );
}
