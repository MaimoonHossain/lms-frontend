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
import { useState, useEffect } from "react";

interface LectureModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lectureTitle: string;
    videoUrl: string;
    isPreviewFree: boolean;
  }) => void;
  defaultValues?: {
    lectureTitle: string;
    videoUrl: string;
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
  const [videoUrl, setVideoUrl] = useState("");
  const [isPreviewFree, setIsPreviewFree] = useState(false);

  // Sync default values when modal opens (important for edit mode)
  useEffect(() => {
    if (defaultValues) {
      setLectureTitle(defaultValues.lectureTitle || "");
      setVideoUrl(defaultValues.videoUrl || "");
      setIsPreviewFree(defaultValues.isPreviewFree || false);
    } else {
      setLectureTitle("");
      setVideoUrl("");
      setIsPreviewFree(false);
    }
  }, [defaultValues, open]);

  const handleSave = () => {
    if (!lectureTitle.trim()) return; // Basic validation
    onSubmit({ lectureTitle, videoUrl, isPreviewFree });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />

          {/* Is Preview Free */}
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='isPreviewFree'
              checked={isPreviewFree}
              onCheckedChange={(checked) =>
                setIsPreviewFree(checked as boolean)
              }
            />
            <label htmlFor='isPreviewFree' className='text-sm font-medium'>
              Make this lecture preview free
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {defaultValues ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
