"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useResendOtp, useVerifyEmail } from "@/hooks/use-auth";
import { VerifyEmailFormData, verifyEmailSchema } from "@/lib/schema/auth.schema";
import { UtilsService } from "@/services/utils.service";

const utilsService = new UtilsService()

export default function VerifyEmailPage() {
  const user = utilsService.getLocalStorage("user")
  
  const form = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      otp: "",
      email: user?.email,
    },
  });

  const verifyEmailMutation = useVerifyEmail();
  const resendOtpMutation = useResendOtp();
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Key for local storage, unique per user email
  const OTP_COOLDOWN_KEY = `otp_cooldown_${user?.email || "unknown"}`;

  // Calculate time left for cooldown
  const getTimeLeft = () => {
    const lastSent = localStorage.getItem(OTP_COOLDOWN_KEY);
    if (!lastSent) return 0;
    const timePassed = (Date.now() - parseInt(lastSent)) / 1000;
    const cooldownSeconds = 120; // 2 minutes
    return Math.max(0, cooldownSeconds - timePassed);
  };

  // Initialize and update timer
  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);
      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [OTP_COOLDOWN_KEY]);

  // Handle resend OTP
  const handleResendOtp = async () => {
    console.log(user.email, timeLeft)
    if (timeLeft > 0 || !user?.email) return;
    try {
      await resendOtpMutation.mutateAsync(user.email);
      localStorage.setItem(OTP_COOLDOWN_KEY, Date.now().toString());
      setTimeLeft(120); // Reset to 2 minutes
      const interval = setInterval(() => {
        const newTimeLeft = getTimeLeft();
        setTimeLeft(newTimeLeft);
        if (newTimeLeft <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  const onSubmit = async (data: VerifyEmailFormData) => {
    try {
      await verifyEmailMutation.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error("OTP verification error:", error);
    }
  };

  // Format time left as MM:SS
  const formatTimeLeft = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section: Form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Verify Your Email
            </h2>
            <p className="text-gray-600">
              Enter the 6-digit OTP sent to your email address.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={form.watch("otp")}
                  onChange={(value) => form.setValue("otp", value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {form.formState.errors.otp && (
                <p className="text-red-500 text-sm text-center">
                  {form.formState.errors.otp.message}
                </p>
              )}
              <Button
                type="submit"
                disabled={verifyEmailMutation.isPending}
                className="main-dark-button w-full"
              >
                {verifyEmailMutation.isPending ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <ClipLoader size={20} color="#fff" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={timeLeft > 0 || resendOtpMutation.isPending}
                onClick={handleResendOtp}
                className="w-full"
              >
                {resendOtpMutation.isPending ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <ClipLoader size={20} color="#000" />
                    <span>Sending...</span>
                  </div>
                ) : timeLeft > 0 ? (
                  `Resend OTP in ${formatTimeLeft(timeLeft)}`
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-gray-600">
            Already verified?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>

      {/* Right Section: Info */}
      <section className="w-1/2 md:flex px-[1%] relative hidden md:sticky md:top-0 md:h-screen">
        <img
          src="/login_image.png"
          alt="verify email"
          className="rounded-2xl h-[96%] w-full self-center object-cover brightness-[80%]"
        />
        <div className="inverted-border-radius !absolute w-fit flex items-center justify-center">
          <div className="mt-4 px-3 z-50 flex items-center gap-x-2 rounded-lg border-l-2 border-l-primary py-2">
            <Image src="/vision.svg" alt="logo" width={52} height={52} />
            <p className="text-sm">
              <span className="font-semibold text-blue">
                Parking Management System
              </span>{" "}
              Streamline your parking operations with our efficient vehicle
              management solution.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}