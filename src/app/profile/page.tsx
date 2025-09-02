"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import axiosInstance from "@/lib/axiosInstance";
import { DummyAvatar } from "@/assets/images";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  subTitle?: string;
  description: string;
  category: string;
  level: string;
  thumbnail: string;
  price: number;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    profilePhoto: "",
  });

  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [formState, setFormState] = useState({ name: "", email: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [open, setOpen] = useState(false);
  const { setUser } = useUserStore();

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      const { _id, name, email, role, photoUrl, token, enrolledCourses } =
        res.data;

      setUserData({ name, email, role, profilePhoto: photoUrl });
      setFormState({ name, email });
      setPreviewUrl(photoUrl || DummyAvatar);

      setEnrolledCourses(enrolledCourses || []);

      setUser({
        id: _id,
        name,
        email,
        role,
        photoUrl,
        token: token || useUserStore.getState().user?.token || "",
      });
    } catch (err) {
      toast.error("Error fetching user profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      if (selectedFile) formData.append("profilePhoto", selectedFile);

      const res = await axiosInstance.patch("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Profile updated");
        setOpen(false);
        setSelectedFile(null);
        fetchUserProfile();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className='max-w-6xl mx-auto px-4 py-10 space-y-10'>
      {/* Profile Info */}
      <div className='flex flex-col md:flex-row items-center gap-6 p-6 bg-white rounded-xl shadow-md'>
        <Image
          src={userData.profilePhoto || DummyAvatar}
          alt='Profile'
          width={80}
          height={80}
          className='rounded-full object-cover w-20 h-20'
        />
        <div className='flex-1 flex flex-col gap-1'>
          <h2 className='text-xl font-semibold text-gray-800'>
            {userData.name}
          </h2>
          <p className='text-gray-600'>{userData.email}</p>
          <span className='text-sm text-gray-500 capitalize'>
            {userData.role}
          </span>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className='mt-3 w-max' variant='outline'>
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                {/* Profile Photo */}
                <div className='flex flex-col items-center gap-3'>
                  <Image
                    src={previewUrl || DummyAvatar}
                    alt='Profile Preview'
                    width={80}
                    height={80}
                    className='rounded-full object-cover w-20 h-20'
                  />
                  <Input
                    id='profilePhoto'
                    type='file'
                    accept='image/*'
                    onChange={handleFileChange}
                  />
                </div>

                {/* Name Input */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='name' className='text-right'>
                    Name
                  </Label>
                  <Input
                    id='name'
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    className='col-span-3'
                  />
                </div>

                {/* Email Input */}
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='email' className='text-right'>
                    Email
                  </Label>
                  <Input
                    id='email'
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    className='col-span-3'
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2'>
                <DialogClose asChild>
                  <Button variant='ghost'>Cancel</Button>
                </DialogClose>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold text-gray-800'>Enrolled Courses</h2>
        {enrolledCourses.length === 0 ? (
          <p className='text-gray-500'>
            You have not enrolled in any courses yet.
          </p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {enrolledCourses.map((course) => (
              <Link
                key={course._id}
                href={`/student/course-details/${course._id}`}
                className='flex flex-col rounded-xl shadow-md hover:shadow-xl transition overflow-hidden bg-white'
              >
                <div className='relative h-48 w-full'>
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className='object-cover w-full h-full'
                  />
                  <span className='absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow'>
                    ${course.price}
                  </span>
                </div>
                <div className='p-4 flex flex-col gap-2'>
                  <h3 className='text-lg font-bold text-gray-900'>
                    {course.title}
                  </h3>
                  <p className='text-gray-500 text-sm truncate'>
                    {course.subTitle ||
                      course.description?.replace(/<[^>]+>/g, "")}
                  </p>
                  <div className='flex items-center gap-2 mt-2'>
                    <span className='text-gray-400 text-sm'>
                      • {course.level}
                    </span>
                  </div>
                  <span className='mt-1 inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full'>
                    {course.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
