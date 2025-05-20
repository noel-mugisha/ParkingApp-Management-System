"use client";
import { useRouter } from "next/navigation";
import { AuthContext } from "./auth-context";
import { useResendOtp } from "@/hooks/use-auth";
import React, { useEffect, useState } from "react";
import { useGetProfile } from "@/hooks/use-profile";
import { UtilsService } from "@/services/utils.service";
import LoadingScreen from "@/components/loading-screen";
import { useApp } from "../app/app-context";

const utilsService = new UtilsService();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user, setUser } = useApp()
  const { data, isLoading, isError } = useGetProfile();
  const resendOtpMutation = useResendOtp();

  useEffect(() => {
    if (data?.data?.user) {
      setUser(data.data.user);
    }
  }, [data]);

  useEffect(() => {
    if (user?.email && !user?.isVerified && !resendOtpMutation.isPending) {
      resendOtpMutation.mutateAsync(user.email).then(() => {
        router.push("/auth/verify-email");
      });
    }
  }, [user]);

  if (isLoading || (user.email !== "" && !user?.isVerified)) {
    return <LoadingScreen />;
  }

  if (isError || data?.status === 401) {
    utilsService.handleUnauthorized();
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};
