/* eslint-disable @typescript-eslint/no-explicit-any */
import { ITokens } from "@/store/zustand";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

interface RefreshTokenResponse {
    code: number;
    message: string;
    data: string; // Giả sử data là accessToken mới
}

class AxiosClient {
    private instance: AxiosInstance;
    private refreshTokenPromise: Promise<string> | null = null;

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        this.setupInterceptors();
    }

    public async fetchApi<T>(
        url: string,
        config: AxiosRequestConfig = {}
    ): Promise<T> {
        try {
            const response = await this.instance.request({
                url,
                ...config,
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private setupInterceptors(): void {
        this.instance.interceptors.request.use(
            (config) => {
                const { accessToken } = this.getTokens();

                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            async (error) => {
                return Promise.reject(error);
            }
        );

        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // Kiểm tra nếu lỗi là 401 và request chưa được thử lại
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true; // Đánh dấu request đã được thử lại

                    try {
                        // Lấy accessToken mới bằng refreshToken
                        const newAccessToken = await this.refreshAccessToken();

                        // Cập nhật header của request ban đầu với token mới
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        // Thử lại request ban đầu
                        return this.instance.request(originalRequest);
                    } catch (refreshError) {
                        // Xử lý lỗi khi refresh token thất bại (ví dụ: đăng xuất người dùng)
                        console.error("Refresh token failed:", refreshError);
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    private async refreshAccessToken(): Promise<string> {
        // Nếu đã có promise refresh token đang chạy, chờ nó hoàn thành
        if (this.refreshTokenPromise) {
            return this.refreshTokenPromise;
        }

        try {
            const { refreshToken } = this.getTokens();
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            this.refreshTokenPromise = axios
                .get<RefreshTokenResponse>(
                    "http://localhost:5000/api/auth/refresh-token",
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                )
                .then((response) => {
                    const newAccessToken = response.data.data;
                    // Lưu accessToken mới vào localStorage
                    localStorage.setItem(
                        "accessToken",
                        JSON.stringify(newAccessToken)
                    );
                    return newAccessToken;
                });

            const newAccessToken = await this.refreshTokenPromise;
            this.refreshTokenPromise = null; // Reset promise sau khi hoàn thành
            return newAccessToken;
        } catch (error) {
            this.refreshTokenPromise = null; // Reset promise nếu lỗi
            throw error;
        }
    }

    private getTokens(): ITokens {
        try {
            const accessToken = localStorage.getItem("accessToken")
                ? JSON.parse(localStorage.getItem("accessToken") as string)
                : null;
            const refreshToken = localStorage.getItem("refreshToken")
                ? JSON.parse(localStorage.getItem("refreshToken") as string)
                : null;
            return { accessToken, refreshToken };
        } catch (error) {
            console.error("Error parsing tokens from localStorage:", error);
            return { accessToken: "", refreshToken: "" };
        }
    }
}

export const authClient = new AxiosClient("http://localhost:5000/api/auth");
export const apiClient = new AxiosClient("http://localhost:5000/api");
