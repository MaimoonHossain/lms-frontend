import { AuthTabs } from "@/common/auth/AuthTabs";
import React from "react";

export default function page() {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <AuthTabs />
    </div>
  );
}
