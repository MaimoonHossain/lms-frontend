"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { DummyAvatar } from "@/assets/images";

export default function NavBar() {
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
    <nav className='flex items-center justify-between px-6 py-4 bg-white shadow'>
      {/* Logo */}
      <Link href='/' className='flex items-center space-x-2'>
        <span className='text-2xl font-bold text-blue-600'>Mentora</span>
      </Link>

      {/* Navigation */}
      <div className='flex items-center space-x-4'>
        {/* {user && user.role === "recruiter" ? (
          <>
            <Link
              href='/recruiter/companies'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              Companies
            </Link>
            <Link
              href='/recruiter/jobs'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              My Jobs
            </Link>
          </>
        ) : (
          <>
            <Link
              href='/'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              Home
            </Link>
            <Link
              href='/jobs'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              Jobs
            </Link>
            <Link
              href='/browse'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              Browse
            </Link>
          </>
        )} */}

        {user ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className='flex items-center space-x-2 focus:outline-none'>
                <Image
                  src={user?.profile?.profilePhoto || DummyAvatar}
                  alt='Avatar'
                  width={32}
                  height={32}
                  className='w-8 h-8 rounded-full object-cover'
                />
                {/* <img
                  src={
                    user.profile?.profilePhoto !== ""
                      ? user.profile.profilePhoto
                      : "/default-avatar.jpg"
                  }
                  alt='Avatar'
                  className='w-8 h-8 rounded-full object-cover'
                /> */}
                <span className='text-gray-700 font-medium'>{user.name}</span>
                <ChevronDownIcon className='w-4 h-4 text-gray-500' />
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              align='end'
              className='bg-white border rounded shadow py-1'
            >
              {user && user.role !== "recruiter" && (
                <DropdownMenu.Item
                  asChild
                  className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
                >
                  <Link href='/profile'>Profile</Link>
                </DropdownMenu.Item>
              )}
              <DropdownMenu.Item
                onSelect={handleLogout}
                className='px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer'
              >
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        ) : (
          <>
            <Link
              href='/login'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              Login
            </Link>
            <Link
              href='/signup'
              className={cn(
                "text-gray-700 hover:text-blue-600 transition-colors font-medium"
              )}
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
