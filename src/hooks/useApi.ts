/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/configs/axios";
import { AxiosRequestConfig } from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";


const fetcherConfig = async <T>(url: string, config: AxiosRequestConfig = {}): Promise<T> => {
    return apiClient.fetchApi<T>(url, config);
};
interface ApiResponse<T> extends SWRResponse<T, any> {
    isLoading: boolean;
    error: any;
}

export function useApi<T>(
    url: string | null,
    config: AxiosRequestConfig = {},
    swrConfig: SWRConfiguration = {}
): ApiResponse<T> {
    const { data, error, isValidating, mutate, ...rest } = useSWR<T>(
        url ? [url, config] : null, // Key for SWR cache, null to disable fetching
        ([url, config]) => fetcherConfig<T>(url, config as AxiosRequestConfig),
        {
            revalidateOnFocus: false, // Disable revalidation on window focus
            revalidateOnReconnect: false, // Disable revalidation on reconnect
            ...swrConfig, // Allow custom SWR configuration
        }
    );

    return {
        data,
        error,
        isValidating,
        mutate,
        ...rest,
    };
}