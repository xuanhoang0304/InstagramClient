"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import InputForm from "./InputForm";
import axios from "axios";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SendOTPFormData, SendOTPShema } from "../schema/SendOTPSchema";
import { toast } from "sonner";
import { CircleX, OctagonAlert } from "lucide-react";
type FormSendOTPType = {
    onSetStep: (step: number) => void;
    onSetEmail: (email: string) => void;
    email: string;
};
export type status = "" | "pending" | "error";
const FormSendOTP = ({ onSetStep, onSetEmail, email }: FormSendOTPType) => {
    const [status, setStatus] = useState<status>("");
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SendOTPFormData>({
        resolver: zodResolver(SendOTPShema()),
        defaultValues: {
            email: email,
        },
    });
    const handleSendOTPRegister = async (data: SendOTPFormData) => {
        try {
            if (status == "error") {
                return;
            }
            setStatus("pending");
            onSetEmail(data.email);
            const response = await axios.post(
                "http://localhost:5000/api/auth/send-otp",
                { ...data, typeOTP: "REGISTER" },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data) {
                toast.success("Gửi OTP thành công:");
                setStatus("");
                onSetStep(2);
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
                } else {
                    toast.warning(error.response?.data?.message, {
                        duration: 3000,
                    });
                }
            }
            setTimeout(() => {
                onSetStep(2);
                setStatus("");
            }, 3000);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handleSendOTPRegister)}
            className=" flex mb-[84px] mt-10 flex-col gap-y-5 bg-[var(--bg-second-white)] dark:bg-primary-bgcl px-4 py-6  lg:max-w-[30%] max-w-[90%]  rounded-lg mx-auto"
        >
            <div className="input-group flex  flex-col gap-y-6">
                <InputForm
                    labelTitle="email"
                    control={control}
                    name="email"
                    inputId="email"
                    error={errors.email}
                ></InputForm>
            </div>
            <button
                type="submit"
                className={cn(
                    "mt-2 px-4 py-2 border border-solid",
                    status !== "" && "bg-gray-200 pointer-events-none "
                )}
            >
                Gửi OTP
            </button>
        </form>
    );
};

export default FormSendOTP;
