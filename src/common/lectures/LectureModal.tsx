"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

interface LectureModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lectureTitle: string;
    videoUrl: string;
    publicId: string;
    isPreviewFree: boolean;
  }) => void;
  defaultValues?: {
    lectureTitle: string;
    videoUrl?: string;
    publicId?: string;
    isPreviewFree: boolean;
  };
}

export function LectureModal({
  open,
  onClose,
  onSubmit,
  defaultValues,
}: LectureModalProps) {
  const [lectureTitle, setLectureTitle] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);
  const [uploadVideoInfo, setUploadVideoInfo] = useState<{
    videoUrl: string;
    publicId: string;
  } | null>(null);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync default values when modal opens
  useEffect(() => {
    if (defaultValues) {
      setLectureTitle(defaultValues.lectureTitle || "");
      setIsPreviewFree(!!defaultValues.isPreviewFree);

      if (defaultValues.videoUrl && defaultValues.publicId) {
        setUploadVideoInfo({
          videoUrl: defaultValues.videoUrl,
          publicId: defaultValues.publicId,
        });
      } else {
        setUploadVideoInfo(null);
      }
    } else {
      setLectureTitle("");
      setIsPreviewFree(false);
      setUploadVideoInfo(null);
    }
    setUploadProgress(null);
    setUploading(false);
  }, [defaultValues, open]);

  const fileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setUploadProgress(0);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MEDIA_API_URL}/upload-video`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (evt.total) {
              const pct = Math.round((evt.loaded * 100) / evt.total);
              setUploadProgress(pct);
            }
          },
        }
      );

      if (response.status === 200) {
        setUploadVideoInfo({
          videoUrl: response.data.data.url,
          publicId: response.data.data.public_id,
        });
        toast.success("Video uploaded successfully");
      } else {
        toast.error("Error uploading video");
      }
    } catch (error) {
      // console.error("Upload failed:", error);
      toast.error("Failed to upload video");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (!lectureTitle.trim()) {
      toast.error("Lecture title is required");
      return;
    }
    // if (!uploadVideoInfo?.videoUrl || !uploadVideoInfo?.publicId) {
    //   toast.error("Please upload a video");
    //   return;
    // }

    onSubmit({
      lectureTitle,
      videoUrl: uploadVideoInfo?.videoUrl ?? "",
      publicId: uploadVideoInfo?.publicId ?? "",
      isPreviewFree,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Edit Lecture" : "Create Lecture"}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {/* Lecture Title */}
          <Input
            placeholder='Lecture Title'
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />

          {/* Video URL */}
          <Input
            placeholder='Video URL'
            value={uploadVideoInfo?.videoUrl || ""}
            onChange={(e) =>
              setUploadVideoInfo((prev) => ({
                ...(prev || { publicId: "" }),
                videoUrl: e.target.value,
              }))
            }
          />

          {/* Public ID */}
          <Input
            placeholder='Public ID'
            value={uploadVideoInfo?.publicId || ""}
            readOnly
          />

          {/* Upload video input & progress */}
          <div>
            <input
              ref={fileInputRef}
              type='file'
              accept='video/*'
              onChange={fileHandler}
              disabled={uploading}
            />
            {uploading && uploadProgress !== null && (
              <div className='mt-2'>
                <div className='w-full bg-gray-200 rounded h-2'>
                  <div
                    className='bg-blue-500 h-2 rounded'
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className='text-xs mt-1'>{uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Video Preview */}
          {uploadVideoInfo?.videoUrl && (
            <video
              src={uploadVideoInfo.videoUrl}
              controls
              className='w-full rounded border'
              preload='metadata'
            />
          )}

          {/* Is Preview Free */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isPreviewFree'
              checked={isPreviewFree}
              onCheckedChange={(checked) => setIsPreviewFree(!!checked)}
            />
            <label htmlFor='isPreviewFree' className='text-sm font-medium'>
              Make this lecture preview free
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={uploading}>
            {defaultValues ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
