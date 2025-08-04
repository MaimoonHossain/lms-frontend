"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { useUserStore } from "@/store/useUserStore";
import axiosInstance from "@/lib/axiosInstance";
import { DummyAvatar } from "@/assets/images";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

export default function Navbar() {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.get("/user/logout");

      if (res.data.success) {
        clearUser();
        toast.success("Logged out successfully");
        router.push("/login");
      }
    } catch (err) {
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className='w-full px-6 py-4 flex items-center justify-between bg-white shadow-sm sticky top-0 z-50'>
      {/* Logo */}
      <Link href='/' className='flex items-center space-x-2'>
        <span className='text-2xl font-bold text-blue-600'>Mentora</span>
      </Link>

      {/* Right Side */}
      {user ? (
        <Popover>
          <PopoverTrigger asChild>
            <button className='flex items-center space-x-2 cursor-pointer'>
              <Image
                src={user?.profile?.profilePhoto || DummyAvatar}
                alt='Avatar'
                width={32}
                height={32}
                className='w-8 h-8 rounded-full object-cover'
              />
              <span className='text-gray-700 font-medium'>
                {user?.name || "User"}
              </span>
              <ChevronDownIcon className='w-4 h-4 text-gray-500' />
            </button>
          </PopoverTrigger>

          <PopoverContent
            className='w-40 p-2 bg-white rounded-md shadow-md z-50'
            align='end'
            side='bottom'
            sideOffset={8}
          >
            <button
              onClick={handleLogout}
              className='w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded'
            >
              Logout
            </button>
          </PopoverContent>
        </Popover>
      ) : (
        <Link
          href='/login'
          className='text-blue-600 font-medium hover:underline transition duration-150'
        >
          Log In
        </Link>
      )}
    </nav>
  );
}
