"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User, Tag, Layers, DollarSign } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";
import { useParams } from "next/dist/client/components/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { CourseFormValues, courseSchema } from "@/lib/validation/courseSchema";
import LecturesTable from "@/common/lectures/LecturesTable";
import { CreateLectureModal } from "@/common/lectures/LectureModal";

interface CourseDetailsPageProps {
  // Replace 'any' with your inferred type from zod
  course: z.infer<typeof courseSchema>;
}

const CourseDetailsPage: FC<CourseDetailsPageProps> = () => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseFormValues | null>(null);
  const { id } = params as { id: string };

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`course/get-course-by-id/${id}`);
      setCourse(res.data);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className='container mx-auto py-6 px-4 space-y-8'>
      {/* Course Header */}
      <div className='flex flex-col md:flex-row gap-8'>
        {/* Thumbnail */}
        <div className='w-full md:w-1/3'>
          <Image
            src={course.thumbnail}
            alt={course.title}
            width={500}
            height={300}
            className='rounded-xl object-cover shadow-lg'
          />
        </div>

        {/* Info */}
        <div className='flex-1 space-y-4'>
          <div className='flex items-center gap-3 flex-wrap'>
            <Badge variant='secondary'>{course.category}</Badge>
            <Badge variant='outline' className='capitalize'>
              {course.level}
            </Badge>
            {course.isPublished ? (
              <Badge className='bg-green-600 text-white'>Published</Badge>
            ) : (
              <Badge className='bg-gray-400 text-white'>Draft</Badge>
            )}
          </div>

          <h1 className='text-3xl font-bold'>{course.title}</h1>
          <p className='text-lg text-muted-foreground'>{course.subTitle}</p>

          <Separator />

          {/* Stats */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
            <Card className='shadow-sm'>
              <CardContent className='flex items-center gap-2 py-4'>
                <DollarSign className='w-5 h-5 text-muted-foreground' />
                <span className='font-medium'>${course.price}</span>
              </CardContent>
            </Card>
            <Card className='shadow-sm'>
              <CardContent className='flex items-center gap-2 py-4'>
                <Layers className='w-5 h-5 text-muted-foreground' />
                <span className='font-medium'>
                  {course.lectures.length} Lectures
                </span>
              </CardContent>
            </Card>
            <Card className='shadow-sm'>
              <CardContent className='flex items-center gap-2 py-4'>
                <User className='w-5 h-5 text-muted-foreground' />
                <span className='font-medium'>
                  {course.enrolledStudents.length} Students
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Creator */}
          <div className='flex items-center gap-3 mt-4'>
            <User className='w-5 h-5 text-muted-foreground' />
            <div>
              <p className='font-medium'>{course.creator.name}</p>
              <p className='text-sm text-muted-foreground'>
                {course.creator.email}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className='flex items-center gap-2 text-sm text-muted-foreground mt-2'>
            <CalendarDays className='w-4 h-4' />
            Created {format(new Date(course.createdAt), "MMMM dd, yyyy")}
          </div>
        </div>
      </div>

      {/* Description */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle>Course Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className='prose prose-sm max-w-none'
            dangerouslySetInnerHTML={{ __html: course.description }}
          />
        </CardContent>
      </Card>

      {/* Lectures Table Section (coming soon) */}
      <Card className='shadow-sm'>
        <CardHeader>
          <CardTitle>Lectures</CardTitle>
        </CardHeader>
        <CardContent>
          <LecturesTable courseId={course._id} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailsPage;
