import { Cookies } from "react-cookie";
import axios from "axios";

const cookies = new Cookies();

export class UtilsService {

    // Helper function for API requests
    async handleApiRequest(apiCall: () => Promise<any>): Promise<any> {
        try {
            const response = await apiCall();
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errorData = error.response.data;
                return errorData;
            } else {
                console.error('Unexpected error:', error);
                throw error;
            }
        }
    }

    async getCookie(name: string) {
        const cookie = await cookies.get(name);
        return cookie ? cookie : null;
    }

    // Helper function to set cookies for access and refresh tokens
    setTokensInCookies({ accessToken, refreshToken }: { accessToken?: string, refreshToken?: string }) {
        accessToken && cookies.set("accessToken", accessToken, { path: "/" });

        refreshToken && cookies.set("refreshToken", refreshToken, { path: "/" });
    }

    // Local Storage Helpers
    setLocalStorage({ key, value }: { key: string, value: any }) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }

    getLocalStorage(key: string) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error("Error reading from localStorage:", error);
            return null;
        }
    }

    removeLocalStorage(key: string) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error("Error removing from localStorage:", error);
        }
    }

    handleUnauthorized = () => {
        cookies.remove("accessToken", { path: '/' });
        cookies.remove("refreshToken", { path: '/' });
        location.href = '/auth/login';
        return;
    }
}