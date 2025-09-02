"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import qs from "qs";

interface Course {
  _id: string;
  title: string;
  subTitle: string;
  creator: {
    name: string;
    photoUrl?: string;
  };
  level: string;
  thumbnail: string;
  price: number;
  category: string;
  description?: string;
}

const categoriesList = [
  "Next JS",
  "Data Science",
  "Frontend Development",
  "Fullstack Development",
  "MERN Stack Development",
  "Backend Development",
  "Javascript",
  "Python",
  "Docker",
  "MongoDB",
  "HTML",
];

export default function CourseSearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") || "";

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortByPrice, setSortByPrice] = useState<string>("");

  // Initialize selectedCategories from URL
  useEffect(() => {
    const categoriesFromUrl = searchParams.getAll("categories");
    if (categoriesFromUrl.length > 0) {
      setSelectedCategories(categoriesFromUrl);
    }
  }, [searchParams]);

  // Fetch courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};

      if (query.trim() !== "") params.query = query.trim();
      if (selectedCategories.length > 0) params.categories = selectedCategories;
      if (sortByPrice) params.sortByPrice = sortByPrice;

      const res = await axiosInstance.get("/course/search", {
        params,
        paramsSerializer: (params) =>
          qs.stringify(params, { arrayFormat: "repeat" }),
      });
      setCourses(res.data || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      toast.error("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [query, selectedCategories, sortByPrice]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <section className='w-full min-h-screen bg-gray-50 py-10'>
      <div className='max-w-7xl mx-auto px-6 md:px-12 lg:px-20'>
        <h1 className='text-3xl md:text-4xl font-bold mb-8'>
          Showing results for <span className='text-blue-600'>{query}</span>
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Sidebar */}
          <div className='lg:col-span-1 space-y-6 bg-white p-5 rounded-xl shadow-md'>
            {/* Categories */}
            <div>
              <h3 className='font-semibold text-lg mb-3'>Categories</h3>
              <div className='space-y-2'>
                {categoriesList.map((cat) => (
                  <label
                    key={cat}
                    className='flex items-center gap-2 text-gray-700 cursor-pointer'
                  >
                    <input
                      type='checkbox'
                      className='accent-blue-600'
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className='font-semibold text-lg mt-6 mb-2'>Sort by Price</h3>
              <select
                className='w-full h-10 rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={sortByPrice}
                onChange={(e) => setSortByPrice(e.target.value)}
              >
                <option value=''>Select</option>
                <option value='asc'>Low to High</option>
                <option value='desc'>High to Low</option>
              </select>
            </div>
          </div>

          {/* Course Cards */}
          <div className='lg:col-span-2 space-y-6'>
            {loading ? (
              <div className='flex justify-center items-center h-40'>
                <Loader2 className='animate-spin w-10 h-10 text-blue-600' />
              </div>
            ) : courses.length === 0 ? (
              <p className='text-gray-500 text-lg'>No courses found.</p>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {courses.map((course) => (
                  <Link
                    key={course._id}
                    href={`/student/course-details/${course._id}`}
                    className='flex flex-col rounded-xl shadow-md hover:shadow-xl transition overflow-hidden bg-white'
                  >
                    <div className='relative h-48 md:h-40 w-full'>
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
                      <h2 className='text-lg font-bold text-gray-900'>
                        {course.title}
                      </h2>
                      <p className='text-gray-500 text-sm truncate'>
                        {course.subTitle ||
                          course.description?.replace(/<[^>]+>/g, "")}
                      </p>
                      <div className='flex items-center gap-2 mt-2'>
                        {course.creator?.photoUrl && (
                          <img
                            src={course.creator.photoUrl}
                            alt={course.creator.name}
                            className='w-6 h-6 rounded-full object-cover'
                          />
                        )}
                        <span className='text-gray-600 text-sm'>
                          {course.creator?.name}
                        </span>
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
      </div>
    </section>
  );
}
