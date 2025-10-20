"use client";
import { useSearchParams } from "next/navigation";
import { memo, useEffect } from "react";

import Loading from "@/components/layout/loading";
import envConfig from "@/configs/envConfig";

const LoginGoogleCallBack = () => {
  const accessToken = useSearchParams().get("accessToken") as string;
  const refreshToken = useSearchParams().get("refreshToken") as string;
  const newUser = useSearchParams().get("newUser") as string;

  const handleSetCookies = async () => {
    await fetch("/api/setCookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accessToken, refreshToken }),
    });

    if (newUser) {
      window.location.href = `${envConfig.FRONTEND_URL}/account/edit`;
      return;
    }
    window.location.href = envConfig.FRONTEND_URL;
  };
  useEffect(() => {
    if (accessToken && refreshToken) {
      handleSetCookies();
    }
  }, [accessToken, refreshToken]);
  return <Loading></Loading>;
};

export default memo(LoginGoogleCallBack);
