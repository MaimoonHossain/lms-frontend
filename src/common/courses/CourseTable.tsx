"use client";
import { FC } from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
}

export const CourseTable = <T extends object>({
  data,
  columns,
}: TableProps<T>) => {
  return (
    <div className='overflow-x-auto'>
      <table className='w-full border-collapse'>
        <thead>
          <tr className='border-b'>
            {columns.map((col) => (
              <th key={String(col.key)} className='text-left p-2 font-medium'>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className='border-b hover:bg-muted/50'>
              {columns.map((col) => (
                <td key={String(col.key)} className='p-2'>
                  {col.render
                    ? col.render(row[col.key], row)
                    : (row[col.key] as any)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
