"use client";

import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, PlayCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";

export default function CourseProgressPage() {
  const { id } = useParams(); // expects route /course/[id]/progress
  const [lectures, setLectures] = useState<any[]>([]);
  const [currentLecture, setCurrentLecture] = useState<any>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("id:", id);

  // ✅ Fetch lectures from API
  useEffect(() => {
    const fetchLectures = async () => {
      try {
        const res = await axiosInstance.get(`/course/lecture-get-all/${id}`);
        setLectures(res.data);
        if (res.data.length > 0) {
          setCurrentLecture(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
        toast.error("Failed to load lectures.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLectures();
  }, [id]);

  const handleMarkComplete = (id: string) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
      toast.success("Lecture marked as completed!");
    }
  };

  // if (loading) {
  //   return (
  //     <section className='min-h-screen flex items-center justify-center text-gray-700'>
  //       <p>Loading lectures...</p>
  //     </section>
  //   );
  // }

  if (!lectures.length) {
    return (
      <section className='min-h-screen flex items-center justify-center text-gray-700'>
        <p>No lectures available for this course.</p>
      </section>
    );
  }

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
                onClick={() => handleMarkComplete(currentLecture._id)}
                className='bg-blue-600 hover:bg-blue-700'
                disabled={completed.includes(currentLecture._id)}
              >
                {completed.includes(currentLecture._id)
                  ? "Completed ✓"
                  : "Mark as Completed"}
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Lectures Section */}
        <div>
          <Card className='h-full shadow-lg rounded-2xl'>
            <CardContent className='p-4'>
              <h3 className='text-xl font-bold mb-4'>Course Lectures</h3>
              <ScrollArea className='h-[70vh] pr-2'>
                <div className='space-y-3'>
                  {lectures.map((lec) => (
                    <div
                      key={lec._id}
                      onClick={() => setCurrentLecture(lec)}
                      className={`flex items-center justify-between cursor-pointer rounded-lg border p-3 transition hover:bg-gray-100 ${
                        currentLecture?._id === lec._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }`}
                    >
                      <div className='flex items-center gap-2'>
                        {completed.includes(lec._id) ? (
                          <CheckCircle className='w-5 h-5 text-green-500' />
                        ) : (
                          <PlayCircle className='w-5 h-5 text-gray-500' />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            currentLecture?._id === lec._id
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {lec.lectureTitle}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
