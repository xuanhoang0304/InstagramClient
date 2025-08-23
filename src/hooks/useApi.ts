import { AxiosRequestConfig } from 'axios';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

import { apiClient } from '@/configs/axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiResponse<T> extends SWRResponse<T, any> {
    isLoading: boolean;
    error: any;
}
export function useApi<T>(
    url: string | null,
    config: AxiosRequestConfig = {},
    swrConfig: SWRConfiguration = {}
): ApiResponse<T> {
    const fetcherConfig = async <T>(
        url: string,
        config: AxiosRequestConfig = {
            withCredentials: true,
        }
    ): Promise<T> => {
        return apiClient.fetchApi<T>(url, config);
    };

    const { data, error, isValidating, mutate, ...rest } = useSWR<T>(
        url,
        (url) => fetcherConfig<T>(url, config),
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 15 * 60 * 1000, // 15m
            ...swrConfig,
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
