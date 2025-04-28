import axios, { AxiosError, AxiosResponse } from 'axios';
// hooks/useApi.ts
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

export type ApiResponse<T> = {
    data: T | undefined;
    error: AxiosError | undefined;
    isLoading: boolean;
    isValidating: boolean;
    mutate: SWRResponse<T, AxiosError>["mutate"];
};

export type ApiConfig = {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params?: object;
    headers?: object;
    data?: object;
};

const defaultConfig: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
    revalidateOnMount: true,
    refreshInterval: 0,
    dedupingInterval: 1 * 24 * 60 * 60 * 1000, // 1 day
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const fetcher = async (config: ApiConfig): Promise<AxiosResponse["data"]> => {
    const { url, method = "GET", params, headers, data } = config;
    const response = await axiosInstance.request({
        url,
        method,
        params,
        headers,
        data,
    });
    return response.data;
};

export function useApi<T>(
    config: ApiConfig,
    swrOptions: SWRConfiguration = {}
): ApiResponse<T> {
    const { data, error, isValidating, mutate } = useSWR<T, AxiosError>(
        config.url,
        () => fetcher(config),
        { ...defaultConfig, ...swrOptions }
    );

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
    };
}
