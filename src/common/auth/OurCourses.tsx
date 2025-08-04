"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";

const courses = [
  {
    id: 1,
    title: "Fullstack Web Development with React & Node",
    level: "Beginner",
    price: "$49.99",
    image:
      "https://www.shutterstock.com/image-photo/elearning-education-internet-lessons-online-600nw-2158034833.jpg",
    instructor: {
      name: "Sarah Johnson",
      avatar:
        "https://media.istockphoto.com/id/1468138682/photo/happy-elementary-teacher-in-front-of-his-students-in-the-classroom.jpg?s=612x612&w=0&k=20&c=E6m0JNBcrQBkPl0dr5CcTrYZiUm6fwMmgaiQfR8uW7s=",
    },
  },
  {
    id: 2,
    title: "Advanced Machine Learning with Python",
    level: "Advanced",
    price: "$79.99",
    image:
      "https://www.shutterstock.com/image-photo/elearning-education-internet-lessons-online-600nw-2158034833.jpg",
    instructor: {
      name: "Dr. Ahmed Zaman",
      avatar:
        "https://media.istockphoto.com/id/1468138682/photo/happy-elementary-teacher-in-front-of-his-students-in-the-classroom.jpg?s=612x612&w=0&k=20&c=E6m0JNBcrQBkPl0dr5CcTrYZiUm6fwMmgaiQfR8uW7s=",
    },
  },
  {
    id: 3,
    title: "UI/UX Design Principles for Beginners",
    level: "Beginner",
    price: "$39.99",
    image:
      "https://www.shutterstock.com/image-photo/elearning-education-internet-lessons-online-600nw-2158034833.jpg",
    instructor: {
      name: "Emily Chen",
      avatar:
        "https://media.istockphoto.com/id/1468138682/photo/happy-elementary-teacher-in-front-of-his-students-in-the-classroom.jpg?s=612x612&w=0&k=20&c=E6m0JNBcrQBkPl0dr5CcTrYZiUm6fwMmgaiQfR8uW7s=",
    },
  },
];

export default function OurCourses() {
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
              key={course.id}
              className='bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition duration-300'
            >
              {/* Course Image */}
              <div className='relative w-full h-48'>
                <Image
                  src={course.image}
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
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      width={36}
                      height={36}
                      className='w-10 h-10 rounded-full object-cover'
                    />
                    <span className='text-sm font-medium text-gray-700'>
                      {course.instructor.name}
                    </span>
                  </div>

                  {/* Level */}
                  <Badge
                    variant='outline'
                    className={`text-xs px-3 py-1 rounded-full ${
                      course.level === "Advanced"
                        ? "border-red-500 text-red-500"
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
