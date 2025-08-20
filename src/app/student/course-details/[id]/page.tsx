"use client";

import React from "react";
import ReactPlayer from "react-player"; // install: npm install react-player
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";

export default function CourseDetailsPage() {
  // Dummy course data
  const course = {
    title: "Course Title",
    subTitle: "Course Sub-title",
    instructor: "Patel MernStack",
    lastUpdated: "11-11-2024",
    enrolled: 10,
    description: `This comprehensive course is designed for developers who want to learn 
    how to build robust, production-ready web applications using Next.js. You will 
    master server-side rendering, static site generation, API routes, dynamic routing, 
    and much more. By the end of this course, you will be able to create SEO-friendly, 
    scalable, and fast web applications with ease.`,
    price: "$49.99",
    lectures: [
      { id: 1, title: "Introduction to Next.js" },
      { id: 2, title: "Server-side Rendering Deep Dive" },
      { id: 3, title: "Static Site Generation" },
      { id: 4, title: "Deploying to Production" },
    ],
  };

  const handlePurchase = async () => {
    try {
      const res = await axiosInstance.post(
        "/purchase/checkout/create-checkout-session",
        {
          courseId: "689d7d4e6cbe47499390d91c",
        }
      );

      // Handle successful response
      if (res.status === 200) {
        const { url } = res.data;
        // Redirect to Stripe Checkout
        if (url) {
          window.location.href = url;
        }
      }
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast.error("Failed to initiate purchase. Please try again.");
    }
  };

  return (
    <section className='w-full bg-gray-900 text-white'>
      {/* Header Section */}
      <div className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2'>{course.title}</h1>
        <h2 className='text-lg text-gray-300 mb-4'>{course.subTitle}</h2>

        <div className='flex items-center flex-wrap gap-4 text-sm text-gray-400'>
          <span>
            Created By{" "}
            <span className='text-blue-400 font-medium'>
              {course.instructor}
            </span>
          </span>
          <span>• Last updated {course.lastUpdated}</span>
          <span>• Students enrolled: {course.enrolled}</span>
        </div>
      </div>

      {/* Body Section */}
      <div className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Description */}
          <div>
            <h3 className='text-xl font-semibold mb-3'>Description</h3>
            <p className='text-gray-300 leading-relaxed'>
              {course.description}
            </p>
          </div>

          {/* Course Content */}
          <div>
            <h3 className='text-xl font-semibold mb-3'>Course Content</h3>
            <Accordion type='single' collapsible className='w-full'>
              {course.lectures.map((lec) => (
                <AccordionItem key={lec.id} value={`lecture-${lec.id}`}>
                  <AccordionTrigger className='text-gray-200'>
                    {lec.title}
                  </AccordionTrigger>
                  <AccordionContent className='text-gray-400'>
                    Detailed information about "{lec.title}" will be here.
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Right Column */}
        <div className='bg-white text-gray-900 rounded-xl shadow-lg overflow-hidden h-fit'>
          {/* Video Preview */}
          <div className='relative w-full h-52'>
            <ReactPlayer
              url='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              width='100%'
              height='100%'
              controls
            />
          </div>

          {/* Course Info */}
          <div className='p-5 space-y-4'>
            <h3 className='text-base font-medium text-gray-600'>
              Lecture title
            </h3>
            <p className='text-2xl font-bold text-gray-900'>{course.price}</p>
            <Button
              onClick={handlePurchase}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg'
            >
              Purchase Course
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
