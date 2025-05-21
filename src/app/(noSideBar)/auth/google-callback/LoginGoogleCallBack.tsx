"use client";
import Loading from "@/app/loading";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
const LoginGoogleCallBack = () => {
    const accessToken = useSearchParams().get("token") as string;
    const refreshToken = useSearchParams().get("refreshToken");

    useEffect(() => {
        if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", JSON.stringify(accessToken));
            localStorage.setItem("refreshToken", JSON.stringify(refreshToken));
            window.location.href = "http://localhost:3000/";
        }
    }, [accessToken, refreshToken]);
    return <Loading></Loading>;
};

export default LoginGoogleCallBack;
