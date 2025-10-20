"use client";
import axios from "axios";
import { CircleX, OctagonAlert } from "lucide-react";
import { memo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import envConfig from "@/configs/envConfig";
import { cn } from "@/lib/utils";
import { VerifyOTPFormData, VerifyOTPSchema } from "@/schemas/VerifyOTPSchema";
import { zodResolver } from "@hookform/resolvers/zod";

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
        `${envConfig.BACKEND_URL}/api/auth/verify-otp`,
        data,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
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
      className="flex mt-4  flex-col gap-y-5 bg-[var(--bg-second-white)] dark:bg-primary-bgcl w-full rounded-lg"
    >
      <p className="text-left md:text-center text-sm mb-3 font-semibold">
        Chúng tôi đã gửi mã OTP đến email
        <span className="text-primary-blue ml-1">{email}</span> Vui lòng kiểm
        tra tất cả thư của bạn. Mã xác thực gồm 6 chữ số sẽ hết hạn trong vòng
        10 phút.
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
          " px-4 py-2 border border-solid bg-primary-blue font-semibold rounded-lg",
          status !== "" && "bg-primary-blue opacity-60 pointer-events-none",
        )}
      >
        {status === "pending" && (
          <svg
            aria-hidden="true"
            role="status"
            className="inline w-4 h-4 me-3 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
        )}
        Xác thực
      </button>
      <button
        type="button"
        onClick={() => {
          onSetStep(1);
        }}
        className={cn(
          "mt-2 px-4 py-2 border border-solid rounded-lg border-second-gray",
        )}
      >
        Quay lại
      </button>
    </form>
  );
};

export default memo(FormVerifyOTP);
