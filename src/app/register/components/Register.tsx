"use client";

import { useState } from "react";
import FormSendOTP from "./FormSendOTP";
import FormVerifyOTP from "./FormVerifyOTP";
import StepContainer from "./StepContainer";
import FormRegisterUser from "./FormRegisterUser";

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
        <>
            <h1 className="text-center text-3xl font-black">Register</h1>
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
        </>
    );
};

export default Register;
