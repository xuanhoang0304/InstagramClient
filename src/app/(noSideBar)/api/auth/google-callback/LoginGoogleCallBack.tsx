"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import Loading from '@/components/layout/loading';
import envConfig from '@/configs/envConfig';

const LoginGoogleCallBack = () => {
    const accessToken = useSearchParams().get("token") as string;
    const refreshToken = useSearchParams().get("refreshToken");

    useEffect(() => {
        if (accessToken && refreshToken) {
            window.location.href = envConfig.FRONTEND_URL;
        }
    }, [accessToken, refreshToken]);
    return <Loading></Loading>;
};

export default LoginGoogleCallBack;
