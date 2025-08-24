"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, PlayCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export default function CourseProgressPage() {
  const { id: courseId } = useParams(); // route /course/[id]/progress
  const [lectures, setLectures] = useState<any[]>([]);
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const [viewedLectures, setViewedLectures] = useState<string[]>([]);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch course + progress
  const fetchProgress = async () => {
    try {
      const res = await axiosInstance.get(`/progress/${courseId}`);
      const { courseDetails, progress, completed } = res.data.data;

      setLectures(courseDetails.lectures || []);
      setCurrentLecture(courseDetails.lectures?.[0] || null);
      setViewedLectures(
        progress.filter((p: any) => p.viewed).map((p: any) => p.lectureId)
      );
      setCourseCompleted(completed);
    } catch (error) {
      console.error("Error fetching course progress:", error);
      toast.error("Failed to load course progress.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchProgress();
  }, [courseId]);

  // ✅ Mark a lecture as completed
  const handleMarkLectureComplete = async (lectureId: string) => {
    try {
      await axiosInstance.post(`/progress/lectures/${courseId}/${lectureId}`);
      toast.success("Lecture marked as completed!");
      fetchProgress(); // refresh
    } catch (error) {
      console.error("Error updating lecture progress:", error);
      toast.error("Failed to update lecture progress.");
    }
  };

  // ✅ Mark entire course as completed
  const handleMarkCourseCompleted = async () => {
    try {
      await axiosInstance.post(`/progress/completed/${courseId}`);
      toast.success("Course marked as completed!");
      fetchProgress();
    } catch (error) {
      toast.error("Failed to mark course as completed.");
    }
  };

  // ✅ Reset progress
  const handleResetProgress = async () => {
    try {
      await axiosInstance.post(`/progress/reset/${courseId}`);
      toast.success("Course progress reset!");
      fetchProgress();
    } catch (error) {
      toast.error("Failed to reset progress.");
    }
  };

  if (loading) {
    return (
      <section className='min-h-screen flex items-center justify-center text-gray-700'>
        <p>Loading lectures...</p>
      </section>
    );
  }

  if (!lectures.length) {
    return (
      <section className='min-h-screen flex items-center justify-center text-gray-700'>
        <p>No lectures available for this course.</p>
      </section>
    );
  }

  const handleLectureProgress = async (lectureId: string) => {
    try {
      await axiosInstance.post(`/progress/lectures/${courseId}/${lectureId}`);
      // toast.success("Lecture marked as completed!");
      fetchProgress(); // refresh
    } catch (error) {
      console.error("Error updating lecture progress:", error);
      toast.error("Failed to update lecture progress.");
    }
  };

  return (
    <section className='min-h-screen bg-gray-50 text-gray-900 py-6'>
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 md:px-8'>
        {/* Video Player Section */}
        <div className='lg:col-span-2 space-y-4'>
          <Card className='overflow-hidden shadow-xl rounded-2xl'>
            <CardContent className='p-0'>
              <div className='w-full aspect-video bg-black'>
                {currentLecture?.videoUrl ? (
                  <video
                    src={currentLecture.videoUrl.replace("http://", "https://")}
                    controls
                    className='w-full h-full object-cover'
                    onPlay={() => handleLectureProgress(currentLecture._id)}
                  />
                ) : (
                  <div className='w-full h-full flex items-center justify-center text-white'>
                    No video available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className='flex justify-between items-center'>
            <h2 className='text-lg font-semibold'>
              Lecture: {currentLecture?.lectureTitle}
            </h2>
            {currentLecture && (
              <Button
                onClick={() => handleMarkLectureComplete(currentLecture._id)}
                className='bg-blue-600 hover:bg-blue-700'
                disabled={viewedLectures.includes(currentLecture._id)}
              >
                {viewedLectures.includes(currentLecture._id)
                  ? "Completed ✓"
                  : "Mark as Completed"}
              </Button>
            )}
          </div>

          <div className='flex gap-2'>
            <Button
              onClick={handleMarkCourseCompleted}
              disabled={courseCompleted}
            >
              {courseCompleted ? "Course Completed ✓" : "Mark Course Completed"}
            </Button>
            <Button variant='outline' onClick={handleResetProgress}>
              Reset Progress
            </Button>
          </div>
        </div>

        {/* Sidebar Lectures Section */}
        <div>
          <Card className='h-full shadow-lg rounded-2xl'>
            <CardContent className='p-4'>
              <h3 className='text-xl font-bold mb-4'>Course Lectures</h3>
              <ScrollArea className='h-[70vh] pr-2'>
                <div className='space-y-3'>
                  {lectures.map((lec) => {
                    const isViewed = viewedLectures.includes(lec._id);
                    return (
                      <div
                        key={lec._id}
                        onClick={() => setCurrentLecture(lec)}
                        className={`flex items-center justify-between cursor-pointer rounded-lg border p-3 transition 
            ${
              isViewed
                ? "border-green-500 bg-green-50 hover:bg-green-100"
                : "border-gray-200 hover:bg-gray-100"
            }`}
                      >
                        <div className='flex items-center gap-2'>
                          {isViewed ? (
                            <CheckCircle className='w-5 h-5 text-green-500' />
                          ) : (
                            <PlayCircle className='w-5 h-5 text-gray-500' />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              isViewed ? "text-green-700" : "text-gray-700"
                            }`}
                          >
                            {lec.lectureTitle}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
