"use client";
import { useState } from "react";
import Link from "next/link";
import { DashboardIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { BookOpenIcon } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='flex'>
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen p-4 flex flex-col transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          aria-label='Toggle sidebar'
          className='mb-6 text-xl'
          onClick={() => setIsOpen(!isOpen)}
        >
          <HamburgerMenuIcon width={24} height={24} />
        </button>

        {/* Menu */}
        <nav className='space-y-4'>
          {/* Dashboard */}
          <Link
            href='/admin'
            className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition'
          >
            <DashboardIcon width={20} height={20} />
            {isOpen && <span>Dashboard</span>}
          </Link>

          {/* Courses */}
          <Link
            href='/admin/courses'
            className='flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition'
          >
            <BookOpenIcon width={20} height={20} />
            {isOpen && <span>Courses</span>}
          </Link>
        </nav>
      </div>
    </div>
  );
}
