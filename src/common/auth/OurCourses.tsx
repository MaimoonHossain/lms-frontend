"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/lib/axiosInstance";

type Instructor = {
  name: string;
  photoUrl: string;
};

type Course = {
  _id: string;
  title: string;
  level: string;
  price: number;
  thumbnail: string;
  creator: Instructor;
  isPublished: boolean;
};

export default function OurCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axiosInstance.get("/course/get-published-courses");
        const data = res.data;

        // Only take published courses
        const publishedCourses = data
          .filter((course: Course) => course.isPublished)
          .map((course: Course) => ({
            _id: course._id,
            title: course.title,
            level: course.level ?? "Beginner",
            price: course.price === 0 ? "Free" : `$${course.price}`,
            thumbnail: course.thumbnail,
            creator: {
              name: course.creator?.name ?? "Unknown Instructor",
              photoUrl: course.creator?.photoUrl,
            },
          }));

        setCourses(publishedCourses);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <p className='text-center py-20'>Loading courses...</p>;
  if (error) return <p className='text-center py-20 text-red-500'>{error}</p>;

  return (
    <section className='w-full py-20 px-6 md:px-10 lg:px-20 bg-white'>
      <div className='max-w-6xl mx-auto'>
        {/* Section Title */}
        <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4'>
          Our <span className='text-blue-600'>Courses</span>
        </h2>
        <p className='text-center text-gray-600 mb-12'>
          Learn from the best instructors with courses crafted to help you grow.
        </p>

        {/* Cards */}
        <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          {courses.map((course) => (
            <div
              key={course._id}
              className='bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition duration-300'
            >
              {/* Course Image */}
              <div className='relative w-full h-48'>
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  layout='fill'
                  objectFit='cover'
                  className='rounded-t-xl'
                />
              </div>

              {/* Content */}
              <div className='p-5 space-y-4'>
                {/* Title */}
                <h3 className='text-xl font-semibold text-gray-900'>
                  {course.title}
                </h3>

                {/* Instructor + Level */}
                <div className='flex items-center justify-between'>
                  {/* Instructor */}
                  <div className='flex items-center gap-2'>
                    <Image
                      src={course.creator.photoUrl}
                      alt={course.creator.name}
                      width={36}
                      height={36}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <span className='text-sm font-medium text-gray-700'>
                      {course.creator.name}
                    </span>
                  </div>

                  {/* Level */}
                  <Badge
                    variant='outline'
                    className={`text-xs px-3 py-1 rounded-full ${
                      course.level.toLowerCase() === "advanced"
                        ? "border-red-500 text-red-500"
                        : course.level.toLowerCase() === "intermediate"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-green-500 text-green-500"
                    }`}
                  >
                    {course.level}
                  </Badge>
                </div>

                {/* Price */}
                <div className='text-right'>
                  <span className='text-lg font-bold text-blue-600'>
                    {course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
