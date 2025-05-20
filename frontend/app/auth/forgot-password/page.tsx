"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ClipLoader } from "react-spinners";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/lib/schema/auth.schema";
import { useForgotPassword } from "@/hooks/use-auth";

export default function ForgotPasswordPage() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useForgotPassword()

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      form.reset();
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section: Form */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Reset Your Password
            </h2>
            <p className="text-gray-600">
              Enter your email to receive a password reset link.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="you@example.com"
                description="We'll send a password reset link to this email."
              />
              <Button
                type="submit"
                disabled={forgotPasswordMutation.isPending}
                className="main-dark-button w-full"
              >
                {forgotPasswordMutation.isPending ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <ClipLoader size={20} color="#fff" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-gray-600">
            Remember your password?{" "}
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
          alt="forgot password"
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
