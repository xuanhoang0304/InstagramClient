"use client";

import Link from "next/link";
import { memo, useState } from "react";

import { cn } from "@/lib/utils";

import FormRegisterUser from "./FormRegisterUser";
import FormSendOTP from "./FormSendOTP";
import FormVerifyOTP from "./FormVerifyOTP";
import StepContainer from "./StepContainer";

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const handleSetStep = (step: number) => {
    setStep(step);
  };
  const handleSetEmail = (email: string) => {
    setEmail(email);
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[100vh] mx-auto md:max-w-[500px] px-4 py-10",
        step === 3 && "md:max-w-[70%]",
      )}
    >
      <div className="text-center size-full">
        {step !== 4 && (
          <h1 className="text-2xl md:text-3xl font-black">Đăng ký tài khoản</h1>
        )}
        {step !== 4 && <StepContainer step={step}></StepContainer>}

        {step === 1 && (
          <FormSendOTP
            onSetStep={handleSetStep}
            onSetEmail={handleSetEmail}
            email={email}
          ></FormSendOTP>
        )}
        {step === 2 && (
          <FormVerifyOTP
            onSetStep={handleSetStep}
            email={email}
          ></FormVerifyOTP>
        )}
        {step >= 3 && (
          <FormRegisterUser
            onSetStep={handleSetStep}
            email={email}
            step={step}
          ></FormRegisterUser>
        )}

        {step !== 4 && (
          <p className="mt-4 font-semibold">
            Bạn đã có tài khoản?{" "}
            <Link
              href={"/login"}
              className="text-primary-blue hover:underline transition-colors text-sm"
            >
              Đăng nhập
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(Register);
