"use client";
import { useApp } from "@/contexts/app/app-context";

const Page = () => {
  const { user } = useApp();
  console.log(user);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {user
            ? `Welcome, ${user.firstName || "User"}`
            : "Welcome to your profile"}
        </h1>
        <p className="text-gray-600">
          {user
            ? "Your profile information is loaded."
            : "Please sign in to view your profile."}
        </p>
      </div>
    </div>
  );
};

export default Page;
