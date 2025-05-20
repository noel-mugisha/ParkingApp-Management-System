// app/auth/layout.tsx
import LoadingScreen from "@/components/loading-screen";
import React, { Suspense } from "react";
import { Metadata } from "next";
import { cookies } from "next/headers";
import AuthClientWrapper from "@/components/auth-client-wrapper";

export const metadata: Metadata = {
  title: "PMS | Auth",
  description: "Parking Management System",
};

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const token = (await cookies()).get("accessToken")?.value;
  
  return (
    <AuthClientWrapper token={token}>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </AuthClientWrapper>
  );
};

export default AuthLayout;