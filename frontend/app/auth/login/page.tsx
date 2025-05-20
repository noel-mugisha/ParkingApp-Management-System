"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useLogin } from "@/hooks/use-auth";
import { ClipLoader } from "react-spinners";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/schema/auth.schema";

export default function LoginPage() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    try {
      loginMutation.mutateAsync(data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <Image src="/vision.svg" alt="logo" width={70} height={70} />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to PMS! ✨
          </h2>
          <p className="text-gray-600 mt-2">
            Your trusted parking and vehicle management system.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              description="Your email address for login."
            />
            <FormInput
              control={form.control}
              name="password"
              label="Password"
              placeholder="••••••••"
              type="password"
              description="Enter your password."
            />
            
            <p className="text-right text-sm text-gray-600">
              Forgot your password?{" "}
              <Link
                href="/auth/forgot-password"
                className="text-blue-600 hover:underline font-medium"
              >
                Reset Password
              </Link>
            </p>
            
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="main-dark-button w-full mt-4"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center gap-x-2">
                  <ClipLoader size={20} color="#fff" />
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}