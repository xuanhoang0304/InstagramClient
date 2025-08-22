"use client";

import { useState } from 'react';

import FormRegisterUser from './FormRegisterUser';
import FormSendOTP from './FormSendOTP';
import FormVerifyOTP from './FormVerifyOTP';
import StepContainer from './StepContainer';

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
        <div className="flex items-center justify-center h-full min-h-[100vh] mx-auto md:max-w-[80%] px-4 py-10">
            <div className="text-center w-full">
                <h1 className="text-2xl md:text-3xl font-black">Đăng ký tài khoản</h1>
                <StepContainer step={step}></StepContainer>

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
                {step === 3 && (
                    <FormRegisterUser
                        onSetStep={handleSetStep}
                        email={email}
                    ></FormRegisterUser>
                )}
            </div>
        </div>
    );
};

export default Register;
