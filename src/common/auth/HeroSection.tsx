"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function HeroSection() {
  return (
    <section className='w-full bg-gradient-to-br from-blue-50 via-white to-purple-400 py-24 px-6 md:px-10 lg:px-20'>
      <div className='max-w-5xl mx-auto text-center'>
        {/* Heading */}
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900'>
          Find the best <span className='text-blue-600'>course</span> for you
        </h1>

        {/* Description */}
        <p className='mt-4 text-lg text-gray-600'>
          Explore thousands of online courses to upgrade your skills, boost your
          career, or learn something new.
        </p>

        {/* Search Bar */}
        <div className='mt-8 flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Input
            type='text'
            placeholder='Search for courses...'
            className='w-full sm:w-[400px] h-12 rounded-xl shadow-md px-4 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none'
          />
          <Button className='h-12 w-full sm:w-auto rounded-xl px-6 bg-blue-600 text-white hover:bg-blue-700 transition duration-200 flex items-center gap-2'>
            <Search className='w-4 h-4' />
            Search
          </Button>
        </div>
        {/* Explore Courses Button */}
        <div className='mt-8'>
          <Button className='h-12 w-50 rounded-xl px-6 bg-blue-600 text-white hover:bg-blue-700 transition duration-200'>
            Explore Courses
          </Button>
        </div>
      </div>
    </section>
  );
}
