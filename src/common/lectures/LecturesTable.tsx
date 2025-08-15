"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmModal } from "@/common/reusable/ConfirmModal";
import { Pencil, Trash2, MoreHorizontal, PlusCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { LectureModal } from "./LectureModal";

interface Lecture {
  _id: string;
  title: string;
  duration: string;
  isPublished: boolean;
}

interface LecturesTableProps {
  courseId: string;
}

export default function LecturesTable({ courseId }: LecturesTableProps) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<{
    isOpen: boolean;
    lectureId: string | null;
  }>({ isOpen: false, lectureId: null });

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    lecture: Lecture | null;
  }>({ isOpen: false, lecture: null });

  const fetchLectures = async () => {
    try {
      const res = await axiosInstance.get(
        `/course/lecture-get-all/${courseId}`
      );
      setLectures(res.data || []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, [courseId]);

  const handleDelete = async (id: string) => {
    try {
      const res = await axiosInstance.delete(`/course/lecture-delete/${id}`);
      if (res.status === 200) {
        setLectures((prev) => prev.filter((lecture) => lecture._id !== id));
        toast.success("Lecture deleted successfully");
        setIsDeleteModalOpen({ isOpen: false, lectureId: null });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete lecture");
    }
  };

  const handleSaveLecture = async (data: any) => {
    try {
      if (modalState.lecture) {
        // Edit
        const res = await axiosInstance.patch(
          `/course/lecture-edit/${modalState.lecture._id}`,
          data
        );
        setLectures((prev) =>
          prev.map((lec) =>
            lec._id === modalState.lecture!._id
              ? { ...lec, ...res.data.lecture }
              : lec
          )
        );
        toast.success("Lecture updated successfully");
      } else {
        // Create
        const res = await axiosInstance.post(
          `/course/lecture-create/${courseId}`,
          data
        );
        setLectures((prev) => [...prev, res.data.newLecture]);
        toast.success("Lecture created successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error saving lecture");
    } finally {
      setModalState({ isOpen: false, lecture: null });
    }
  };

  // if (loading) return <p>Loading lectures...</p>;
  if (error) return <p className='text-red-600'>Error: {error}</p>;

  return (
    <>
      <Card className='shadow-sm border border-gray-200 overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b bg-gray-50'>
          <h2 className='text-lg font-semibold'>Lectures</h2>
          <Button
            className='bg-gray-900 hover:bg-gray-700'
            onClick={() => setModalState({ isOpen: true, lecture: null })}
          >
            <PlusCircle className='mr-2 h-4 w-4' /> Create New Lecture
          </Button>
        </div>

        {lectures.length === 0 ? (
          <div className='flex flex-col items-center gap-4 py-8'>
            <p className='text-gray-500'>No lectures found.</p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full text-sm text-left border-collapse'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-6 py-3 font-medium text-gray-700'>Title</th>
                  <th className='px-6 py-3 font-medium text-gray-700'>
                    Duration
                  </th>
                  <th className='px-6 py-3 font-medium text-gray-700'>
                    Status
                  </th>
                  <th className='px-6 py-3 font-medium text-gray-700 text-right'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {lectures?.map((lecture, idx) => (
                  <tr
                    key={lecture?._id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className='px-6 py-4'>{lecture?.lectureTitle}</td>
                    <td className='px-6 py-4'>{lecture?.duration || "N/A"}</td>
                    <td className='px-6 py-4'>
                      {lecture?.isPublished ? (
                        <span className='px-2 py-1 rounded bg-green-100 text-green-700 text-xs'>
                          Published
                        </span>
                      ) : (
                        <span className='px-2 py-1 rounded bg-red-100 text-red-700 text-xs'>
                          Draft
                        </span>
                      )}
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className='p-1 rounded hover:bg-gray-200'>
                            <MoreHorizontal size={18} />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                          <DropdownMenuItem
                            onClick={() =>
                              setModalState({ isOpen: true, lecture })
                            }
                          >
                            <Pencil className='mr-2 h-4 w-4' /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setIsDeleteModalOpen({
                                isOpen: true,
                                lectureId: lecture._id,
                              })
                            }
                          >
                            <Trash2 className='mr-2 h-4 w-4 text-red-600' />{" "}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <LectureModal
        open={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, lecture: null })}
        onSubmit={handleSaveLecture}
        defaultValues={modalState.lecture || undefined}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen.isOpen}
        onCancel={() =>
          setIsDeleteModalOpen({ isOpen: false, lectureId: null })
        }
        onConfirm={() => {
          if (isDeleteModalOpen.lectureId) {
            handleDelete(isDeleteModalOpen.lectureId);
          }
        }}
        title='Delete Lecture?'
        description='This will permanently remove the lecture.'
      />
    </>
  );
}
