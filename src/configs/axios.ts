/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { getCookie, setCookie } from "cookies-next";
import { toast } from "sonner";

import envConfig from "./envConfig";

interface RefreshTokenResponse {
  code: number;
  message: string;
  data: string;
}

class AxiosClient {
  private instance: AxiosInstance;
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    const accessToken = getCookie("accessToken");
    this.instance = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.setupInterceptors();
  }

  public async fetchApi<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const accessToken = getCookie("accessToken");
      if (config) {
        config.headers = {
          ...(config.headers || {}),
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        };
      }
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
        const accessToken = getCookie("accessToken");
        config.headers.Authorization = `Bearer ${accessToken}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await this.refreshAccessToken();

            return this.instance.request(originalRequest);
          } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }
    try {
      const refreshToken = getCookie("refreshToken");
      this.refreshTokenPromise = axios
        .post<RefreshTokenResponse>(
          `${envConfig.BACKEND_URL}/api/auth/refresh-token`,
          undefined,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        )
        .then(async (response) => {
          const newAccessToken = response.data.data;
          await setCookie("accessToken", newAccessToken, {
            path: "/",
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
          });

          return newAccessToken;
        });

      const newAccessToken = await this.refreshTokenPromise;
      return newAccessToken;
    } catch (error: any) {
      if (error.response?.status !== 401) {
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại", {
          duration: 5000,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
      return "";
    } finally {
      this.refreshTokenPromise = null;
    }
  }
}

export const authClient = new AxiosClient(`${envConfig.BACKEND_URL}/api/auth`);
export const apiClient = new AxiosClient(`${envConfig.BACKEND_URL}/api`);
