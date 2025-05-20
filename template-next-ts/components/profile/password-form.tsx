"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import FormInput from "@/components/form-input";
import { useChangePassword } from "@/hooks/use-auth";
import { ChangePasswordFormData, changePasswordSchema } from "@/lib/schema/auth.schema";

const PasswordForm = () => {
  const changePasswordMutation = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success("Password changed successfully");
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "Failed to change password");
      console.error("Password change error", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          control={form.control}
          name="currentPassword"
          label="Current Password"
          placeholder="Enter your current password"
          type="password"
          description="Your current account password"
        />

        <FormInput
          control={form.control}
          name="newPassword"
          label="New Password"
          placeholder="Enter your new password"
          type="password"
          description="Must contain at least one uppercase, lowercase, number, and special character"
        />

        <FormInput
          control={form.control}
          name="confirmNewPassword"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          type="password"
          description="Must match the new password"
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            className="main-dark-button"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PasswordForm;