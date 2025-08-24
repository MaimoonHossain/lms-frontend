"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation"; // to get courseId from route params
import Link from "next/link";

export default function CourseDetailsPage() {
  const { id } = useParams(); // expects route: /course/[id]
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch course details with purchase status
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosInstance.get(
          `/purchase/course/details-with-status/${id}`
        );
        setCourse({
          ...res.data.course,
          purchased: res.data.purchase,
        }); // your backend returns { course: {..., purchased: true/false } }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // ✅ Handle purchase
  const handlePurchase = async () => {
    try {
      const res = await axiosInstance.post(
        "/purchase/checkout/create-checkout-session",
        { courseId: id }
      );

      if (res.status === 200) {
        const { url } = res.data;
        if (url) {
          window.location.href = url; // redirect to Stripe checkout
        }
      }
    } catch (error) {
      console.error("Error purchasing course:", error);
      toast.error("Failed to initiate purchase. Please try again.");
    }
  };

  if (loading) {
    return (
      <section className='w-full h-screen flex items-center justify-center text-white bg-gray-900'>
        <p>Loading course...</p>
      </section>
    );
  }

  if (!course) {
    return (
      <section className='w-full h-screen flex items-center justify-center text-white bg-gray-900'>
        <p>Course not found.</p>
      </section>
    );
  }

  return (
    <section className='w-full bg-gray-900 text-white h-screen'>
      {/* Header Section */}
      <div className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10'>
        <h1 className='text-3xl md:text-4xl font-bold mb-2'>{course.title}</h1>
        <h2 className='text-lg text-gray-300 mb-4'>{course.subTitle}</h2>

        <div className='flex items-center flex-wrap gap-4 text-sm text-gray-400'>
          <span>
            Created By{" "}
            <span className='text-blue-400 font-medium'>
              {course.creator?.name}
            </span>
          </span>
          <span>
            • Last updated {new Date(course.updatedAt).toLocaleDateString()}
          </span>
          <span>• Students enrolled: {course.enrolledStudents?.length}</span>
        </div>
      </div>

      {/* Body Section */}
      <div className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          {/* Description */}
          <div>
            <h3 className='text-xl font-semibold mb-3'>Description</h3>
            <p
              className='text-gray-300 leading-relaxed'
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
          </div>

          {/* Course Content */}
          <div>
            <h3 className='text-xl font-semibold mb-3'>Course Content</h3>
            <Accordion type='single' collapsible className='w-full'>
              {course.lectures?.map((lec: any, index: number) => (
                <AccordionItem
                  key={lec._id || index}
                  value={`lecture-${index}`}
                >
                  <AccordionTrigger className='text-gray-200'>
                    Lecture {index + 1}
                  </AccordionTrigger>
                  <AccordionContent className='text-gray-400'>
                    Detailed information about this lecture will be here.
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
            {course.lectures &&
            course.lectures.length > 0 &&
            course.lectures[0].videoUrl ? (
              //  default video player
              <video
                src={course.lectures[0].videoUrl}
                controls
                className='w-full h-full object-cover'
              />
            ) : (
              <img
                src={course.thumbnail}
                alt={course.title}
                className='w-full h-full object-cover'
              />
            )}
          </div>

          {/* Course Info */}
          <div className='p-5 space-y-4'>
            <h3 className='text-base font-medium text-gray-600'>
              {course.subTitle}
            </h3>
            <p className='text-2xl font-bold text-gray-900'>${course.price}</p>

            {course.purchased ? (
              <Link
                href={"/student/course-progress/" + course._id}
                className='w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg'
              >
                Continue Course
              </Link>
            ) : (
              <Button
                onClick={handlePurchase}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg'
              >
                Purchase Course
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
