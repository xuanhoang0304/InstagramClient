"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { status } from "@/app/(noSideBar)/register/components/FormSendOTP";
import { LoginFormData, LoginSchema } from "../schemas/FormLoginSchema";
import InputForm from "@/app/(noSideBar)/register/components/InputForm";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CircleX, OctagonAlert } from "lucide-react";
import Image from "next/image";
import { useMyStore } from "@/store/zustand";

const FormLogin = () => {
    const [status, setStatus] = useState<status>("");
    const { setToken, setMyUser } = useMyStore();
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema()),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleLogin = async (data: LoginFormData) => {
        try {
            if (status == "error") return;
            setStatus("pending");
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                data,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data) {
                toast.success("Đăng nhập thành công");
                const accessToken = response.data.result.accessToken;
                const refreshToken = response.data.result.refreshToken;

                localStorage.setItem(
                    "accessToken",
                    JSON.stringify(accessToken)
                );
                localStorage.setItem(
                    "refreshToken",
                    JSON.stringify(refreshToken)
                );

                setStatus("");
                setToken({ accessToken, refreshToken });
                setMyUser(response.data.result.user);
                router.push("/");
            }
        } catch (error) {
            setStatus("error");
            if (axios.isAxiosError(error)) {
                if (!error.response?.data?.errors) {
                    toast.custom((t) => (
                        <div className=" px-2 py-3 rounded relative  border border-gray-300 bg-red-300 ">
                            <div className="flex items-center gap-x-2">
                                <OctagonAlert className="text-red-600 size-4" />
                                <h1 className="text-red-600 text-sm">
                                    {error.response?.data?.message ||
                                        error.message}
                                </h1>
                            </div>
                            <button
                                className="absolute top-[-6px] left-[-6px] z-10 "
                                onClick={() => toast.dismiss(t)}
                            >
                                <CircleX className=" text-red-300 fill-white" />
                            </button>
                        </div>
                    ));

                    setTimeout(() => {
                        setStatus("");
                    }, 2000);
                    return;
                }
            } else {
                console.log("❌ Đăng nhập thất bại:", error);
            }
            setTimeout(() => {
                setStatus("");
            }, 3000);
        }
    };
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:5000/api/auth/google";
    };
    return (
        <>
            <form
                onSubmit={handleSubmit(handleLogin)}
                className={cn(
                    " flex mb-[84px] mt-10 flex-col gap-y-7 bg-[var(--bg-second-white)] dark:bg-primary-bgcl px-4 py-6  lg:max-w-[30%] max-w-[90%]  rounded-lg mx-auto",
                    Object.keys(errors).length > 0 && "gap-y-10"
                )}
            >
                <div className="input-group">
                    <InputForm
                        control={control}
                        inputId="username"
                        name="username"
                        labelTitle="username"
                        error={errors.username}
                        type="text"
                    ></InputForm>
                </div>
                <div className="input-group">
                    <InputForm
                        control={control}
                        inputId="password"
                        name="password"
                        labelTitle="password"
                        error={errors.password}
                        type="password"
                    ></InputForm>
                </div>

                <div className="flex flex-col gap-y-2">
                    <button
                        type="submit"
                        className={cn(
                            "mt-2 px-4 py-2 border border-solid",
                            status !== "" && "bg-gray-400 pointer-events-none "
                        )}
                    >
                        Login
                    </button>
                    <button
                        className="mt-2 px-4 py-2 border border-solid flex items-center gap-x-1 justify-center"
                        type="button"
                        onClick={handleGoogleLogin}
                    >
                        <figure className="size-6">
                            <Image
                                alt="google icon"
                                width={24}
                                height={24}
                                className="size-full object-cover"
                                src="https://storage.googleapis.com/libraries-lib-production/images/GoogleLogo-canvas-404-300px.original.png"
                            ></Image>
                        </figure>
                        <p>Login with Google</p>
                    </button>
                </div>
            </form>
        </>
    );
};

export default FormLogin;
