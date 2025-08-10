"use client";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface CourseActionsProps {
  onEdit: () => void;
}

export const CourseActions: React.FC<CourseActionsProps> = ({ onEdit }) => {
  return (
    <Button variant='outline' size='sm' onClick={onEdit}>
      <Edit className='w-4 h-4 mr-1' /> Edit
    </Button>
  );
};
