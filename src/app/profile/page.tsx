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

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    profilePhoto: "",
  });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [open, setOpen] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      const { name, email, role, photoUrl } = res.data;
      setUserData({ name, email, role, profilePhoto: photoUrl });
      setFormState({ name, email });
      setPreviewUrl(photoUrl || DummyAvatar);
    } catch (err) {
      toast.error("Error fetching user profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // temporary preview
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", formState.name);
      formData.append("email", formState.email);
      if (selectedFile) {
        formData.append("profilePhoto", selectedFile);
      }

      const res = await axiosInstance.patch("/user/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        toast.success("Profile updated");
        setOpen(false);
        fetchUserProfile();
        setSelectedFile(null);
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Error updating profile");
    }
  };

  return (
    <div className='max-w-4xl mx-auto px-4 py-10'>
      <div className='flex items-center gap-6 p-6 bg-white rounded-xl shadow-md'>
        <Image
          src={userData.profilePhoto || DummyAvatar}
          alt='Profile'
          width={80}
          height={80}
          className='rounded-full object-cover w-20 h-20'
        />
        <div className='flex flex-col gap-1'>
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
                {/* Profile Photo Upload */}
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
    </div>
  );
}
