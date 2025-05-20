"use client"
import { toast } from "sonner";
import { useContext } from 'react';
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/auth.service";
import { UtilsService } from "@/services/utils.service";
import { AuthContext } from '@/contexts/auth/auth-context';
import { useMutation } from "@tanstack/react-query";
import {
    ChangePasswordFormData,
    ForgotPasswordFormData,
    RegisterFormData,
    ResetPasswordFormData,
    VerifyEmailFormData
} from "@/lib/schema/auth.schema";

const authService = new AuthService(new UtilsService());
const utils = new UtilsService();

export const useRegister = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (userData: RegisterFormData) =>
            authService.register(userData),
        onSuccess: async (response: {
            success: boolean;
            message: string;
            data: {
                user: User;
                accessToken: string;
                refreshToken: string
            }
        }) => {
            if (response.success) {
                const { data, message } = response;

                utils.setTokensInCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });
                utils.setLocalStorage({ key: "user", value: data.user })
                toast.success(message);
                router.push("/auth/verify-email");
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    });
};

export const useLogin = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (userData: LoginDto) =>
            authService.login(userData),
        onSuccess: async (response: {
            success: boolean;
            message: string;
            data: {
                user: User;
                accessToken: string;
                refreshToken: string
            }
        }) => {
            if (response.success) {
                const { data, message } = response;

                utils.setTokensInCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });
                utils.setLocalStorage({ key: "user", value: data.user })
                toast.success(message);
                router.push('/dashboard');
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordFormData) =>
            authService.changePassword(data),
        onSuccess: async (response) => {
            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (data: ForgotPasswordFormData) =>
            authService.forgotPassword(data),
        onSuccess: async (response) => {
            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    });
};

export const useResetPassword = () => {
    const router = useRouter()

    return useMutation({
        mutationFn: (data: ResetPasswordFormData) =>
            authService.resetPassword(data),
        onSuccess: async (response) => {
            if (response.success) {
                toast.success(response.message);
                router.push('/auth/login');
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    });
};

export const useResendOtp = () => {
    return useMutation({
        mutationFn: (email: string) =>
            authService.resendOtp(email),
        onSuccess: async (response) => {
            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    });
};

export const useVerifyEmail = () => {
    const router = useRouter()
    return useMutation({
        mutationFn: (data: VerifyEmailFormData) =>
            authService.verifyEmail(data),
        onSuccess: async (response) => {
            if (response.success) {
                toast.success(response.message);
                router.push('/dashboard')
            } else {
                toast.error(response.message);
            }
        },
        onError: async (error) => {
            toast.error(error.message);
        }
    });
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};