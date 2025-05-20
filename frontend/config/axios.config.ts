import { UtilsService } from "@/services/utils.service";
import axios, { AxiosInstance } from "axios";
import { useRouter } from "next/router";
import { Cookies } from 'react-cookie';
import { toast } from "sonner";

const cookies = new Cookies();

const API_URL = process.env.API_URL

const commonHeaders = {
    'Content-Type': 'application/json',
};

const unauthorizedAxiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: commonHeaders,
    withCredentials: true,
});

const authorizedAxiosInstance: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        ...commonHeaders,
        Authorization: `Bearer ${cookies.get('accessToken')}`
    },
    withCredentials: true,
});


authorizedAxiosInstance.interceptors.request.use(
    async (config) => {
        const token = await cookies.get('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

authorizedAxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async function (error) {
        if (error.response.data.message.startsWith("JWT")) {
            try {
                const response = await generateRefreshToken();
                if (response?.success) {
                    error.config.headers.authorization = `Bearer ${response.payload.accessToken}`
                    return authorizedAPI.request(error.config);
                }
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const generateRefreshToken = async () => {
    const utilsService = new UtilsService()
    const router = useRouter()

    try {
        const refreshToken = await cookies.get("refreshToken")
        const response = await authorizedAPI.post(`/auth/refresh-token`, { refreshToken: refreshToken });
        if (response.data.success) {
            utilsService.setTokensInCookies({ accessToken: response.data.payload.accessToken })
        }
        return response.data
    } catch (error: any) {
        if (error.response.status === 500 && error.response.data.error === "Invalid Refresh token." && process.env.NODE_ENV === "production") {
            cookies.remove("accessToken", { path: '/' })
            cookies.remove("refreshToken", { path: '/' })
            router.push('/auth/login')
        } else {
            toast.error(error.response.data.error)
        }
    }
};

export const unauthorizedAPI = unauthorizedAxiosInstance;
export const authorizedAPI = authorizedAxiosInstance;