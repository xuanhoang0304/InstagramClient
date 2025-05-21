"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { VerifyOTPFormData, VerifyOTPSchema } from "../schema/VerifyOTPSchema";
import axios from "axios";
import { toast } from "sonner";
import { CircleX, OctagonAlert } from "lucide-react";
import { useState } from "react";
import { status } from "./FormSendOTP";
type FormVerifyOTPType = {
    onSetStep: (step: number) => void;
    email: string;
};
const FormVerifyOTP = ({ onSetStep, email }: FormVerifyOTPType) => {
    const [status, setStatus] = useState<status>("");
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyOTPFormData>({
        resolver: zodResolver(VerifyOTPSchema()),
        defaultValues: {
            email: email || "",
            otp: "",
        },
    });
    const handleVerifyOTP = async (data: VerifyOTPFormData) => {
        try {
            if (status == "error") return;
            setStatus("pending");
            const response = await axios.post(
                "http://localhost:5000/api/auth/verify-otp",
                data,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data) {
                toast.success("Xác thực OTP thành công");
                setStatus("");
                onSetStep(3);
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
                                    {error.response?.data?.message}
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
                onSetStep(2);
            } else {
                console.log("❌ Gửi OTP thất bại:", error);
            }
            setTimeout(() => {
                setStatus("");
            }, 3000);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleVerifyOTP)}
            className=" flex mb-[84px] mt-10 flex-col gap-y-5 bg-[var(--bg-second-white)] dark:bg-primary-bgcl px-4 py-6  lg:max-w-[30%] max-w-[90%]  rounded-lg mx-auto"
        >
            <p className="text-center">
                Chúng tôi đã gửi mã OTP đến email :{status}
                <span className="text-red-400">{email}</span>
            </p>
            <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                    <>
                        <InputOTP maxLength={6} {...field} className="w-full">
                            <InputOTPGroup className="w-full justify-around">
                                <InputOTPSlot index={0} {...field} />
                                <InputOTPSlot index={1} {...field} />
                                <InputOTPSlot index={2} {...field} />
                                <InputOTPSlot index={3} {...field} />
                                <InputOTPSlot index={4} {...field} />
                                <InputOTPSlot index={5} {...field} />
                            </InputOTPGroup>
                        </InputOTP>
                        {errors && (
                            <p className="text-red-500 text-xs  mt-1">
                                {errors?.otp?.message}
                            </p>
                        )}
                    </>
                )}
            />

            <button
                type="submit"
                className={cn(
                    "mt-2 px-4 py-2 border border-solid",
                    status !== "" && "bg-gray-400 pointer-events-none "
                )}
            >
                Confirm
            </button>
            <button
                type="button"
                onClick={() => {
                    onSetStep(1);
                }}
                className={cn("mt-2 px-4 py-2 border border-solid")}
            >
                Back
            </button>
        </form>
    );
};

export default FormVerifyOTP;
