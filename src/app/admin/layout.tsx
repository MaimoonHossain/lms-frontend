// app/(admin)/layout.js
"use client";

import Sidebar from "@/common/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen bg-gray-100'>
      {/* Sidebar */}
      <Sidebar />

      {/* Page Content */}
      <main className='flex-1 p-6 overflow-auto'>{children}</main>
    </div>
  );
}
