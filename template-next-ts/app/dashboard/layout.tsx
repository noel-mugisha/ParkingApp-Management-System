import React, { Suspense } from "react";
import { AuthProvider } from "@/contexts/auth/auth-provider";
import AppLayout from "@/components/layout/app-layout";
import LoadingScreen from "@/components/loading-screen";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AuthProvider>
        <AppLayout>{children}</AppLayout>
      </AuthProvider>
    </Suspense>
  );
};

export default DashboardLayout;
