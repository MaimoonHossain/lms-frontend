"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog } from "@radix-ui/react-dialog";
import {
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

  const [open, setOpen] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const res = await axiosInstance.get("/user/profile");
      const { name, email, role, profilePhoto } = res.data;
      setUserData({ name, email, role, profilePhoto });
      setFormState({ name, email }); // for editing
    } catch (err) {
      toast.error("Error fetching user profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await axiosInstance.patch("/user/profile/update", {
        name: formState.name,
        email: formState.email,
      });

      if (res.status === 200) {
        toast.success("Profile updated");
        setOpen(false);
        fetchUserProfile(); // refresh UI
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
