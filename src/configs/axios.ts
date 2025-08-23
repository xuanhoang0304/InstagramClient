/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { ITokens } from '@/store/zustand';
import { getMe } from '@/types/types';

import envConfig from './envConfig';

interface RefreshTokenResponse {
    code: number;
    message: string;
    data: string;
}

class AxiosClient {
    private instance: AxiosInstance;
    private refreshTokenPromise: Promise<string> | null = null;
    private tokenCache: { tokens: ITokens; expiry: number } | null = null; // Cache tokens và thời gian hết hạn

    constructor(baseURL: string) {
        this.instance = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
        });

        this.setupInterceptors();
    }

    public async fetchApi<T>(
        url: string,
        config: AxiosRequestConfig = {}
    ): Promise<T> {
        try {
            const response = await this.instance.request({ url, ...config });
            return response.data;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                throw error;
            }
            throw new Error(error.message);
        }
    }

    private setupInterceptors(): void {
        this.instance.interceptors.request.use(
            async (config) => {
                // const { accessToken } = await this.getTokens();
                // if (accessToken) {
                //     config.headers.Authorization = `Bearer ${accessToken}`;
                // }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const newAccessToken = await this.refreshAccessToken();
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                        // Xóa cache khi refresh token thành công
                        this.tokenCache = null;
                        return this.instance.request(originalRequest);
                    } catch (refreshError) {
                        console.error("Refresh token failed:", refreshError);
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private async refreshAccessToken(): Promise<string> {
        if (this.refreshTokenPromise) {
            return this.refreshTokenPromise;
        }

        try {
            const { refreshToken } = await this.getTokens();
            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            this.refreshTokenPromise = axios
                .get<RefreshTokenResponse>(
                    `${envConfig.BACKEND_URL}/api/auth/refresh-token`,
                    {
                        // headers: {
                        //     Authorization: `Bearer ${refreshToken}`,
                        // },
                        withCredentials: true,
                    }
                )
                .then((response) => {
                    const newAccessToken = response.data.data;
                    return newAccessToken;
                });

            const newAccessToken = await this.refreshTokenPromise;
            this.refreshTokenPromise = null;
            return newAccessToken;
        } catch (error) {
            this.refreshTokenPromise = null;
            throw error;
        }
    }

    private async getTokens(): Promise<ITokens> {
        // Kiểm tra cache
        const now = Date.now();
        if (this.tokenCache && this.tokenCache.expiry > now) {
            return this.tokenCache.tokens;
        }

        try {
            const res = await fetch(`${envConfig.BACKEND_URL}/api/auth/@me`, {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data: getMe = await res.json();

            const tokens: ITokens = {
                accessToken: data.result.accessToken,
                refreshToken: data.result.refreshToken,
            };

            // Lưu vào cache với thời gian sống (TTL) là 14 phút (dưới 15 phút của accessToken)
            this.tokenCache = {
                tokens,
                expiry: now + 14 * 60 * 1000, // Cache hết hạn sau 14 phút
            };

            return tokens;
        } catch (error) {
            console.error("Error fetching tokens:", error);
            this.tokenCache = null;
            return { accessToken: "", refreshToken: "" };
        }
    }
}

export const authClient = new AxiosClient(`${envConfig.BACKEND_URL}/api/auth`);
export const apiClient = new AxiosClient(`${envConfig.BACKEND_URL}/api`);
