"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useApp } from "@/contexts/app/app-context";

const ProfileForm = () => {
  const { user } = useApp();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const updateProfileMutation = useUpdateProfile();

  // Sync firstName and lastName with user data when user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({ firstName, lastName });
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarFallback className="text-2xl">
              {firstName && lastName
                ? `${firstName[0]}${lastName[0]}`
                : user?.email?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="w-full space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ""}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          className="main-dark-button"
          disabled={updateProfileMutation.isPending}
        >
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
