"use client";

import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { ClipLoader } from "react-spinners";
import { useRegister } from "@/hooks/use-auth";
import FormInput from "@/components/form-input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schema/auth.schema";

export default function RegisterPage() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const registerMutation = useRegister();

  async function onSubmit(data: RegisterFormData) {
    try {
      registerMutation.mutateAsync(data);
    } catch (error) {
      console.error("Register error:", error);
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row-reverse">
      {/* Left Section: Form (Scrollable) */}
      <section className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white overflow-y-auto h-full">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Join PMS! ✨</h2>
            <p className="text-gray-600">
              Your trusted parking and vehicle management system.
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="John"
                description="Your first name."
              />
              <FormInput
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Doe"
                description="Your last name."
              />
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="you@example.com"
                description="Your email address for registration."
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="••••••••"
                type="password"
                description="At least 8 characters."
              />
              <FormInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                placeholder="••••••••"
                type="password"
                description="Repeat your password."
              />
              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="main-dark-button w-full"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center justify-center gap-x-2">
                    <ClipLoader size={20} color="#fff" />
                    <span>Registering...</span>
                  </div>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </Form>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>

      {/* Right Section: Info (Fixed) */}
      <section className="w-1/2 hidden md:flex px-[1%] relative md:sticky md:top-0 md:h-screen">
        <img
          src="/signup_image.png"
          alt="register"
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
