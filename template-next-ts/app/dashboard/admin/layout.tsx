"use client";

import React, { Suspense, useEffect } from "react";
import { useApp } from "@/contexts/app/app-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LoadingScreen from "@/components/loading-screen";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (user.email !== "" && user.role !== "Admin") {
      toast.error("You are not authorized to access this resource.");
      router.replace("/dashboard");
    }
  }, [user]);

  if (user?.role !== "Admin") {
    return <LoadingScreen />;
  }

  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};

export default AdminLayout;
