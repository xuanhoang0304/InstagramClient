import { AxiosRequestConfig } from 'axios';
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/configs/axios';

const fetcherConfig = async <T>(
    url: string,
    config: AxiosRequestConfig = {}
): Promise<T> => {
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
        url,
        (url) => fetcherConfig<T>(url, config),
        {
            shouldRetryOnError: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
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
