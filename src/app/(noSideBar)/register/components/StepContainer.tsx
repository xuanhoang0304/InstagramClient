import { cn } from "@/lib/utils";
import StepContent from "./StepContent";

const StepContainer = ({ step }: { step: number }) => {
    return (
        <div className="flex mt-10 items-center gap-x-3 justify-between">
            <StepContent
                isActive={step >= 1 && true}
                stepNumber={1}
                heading="Send OTP"
            ></StepContent>
            <div
                className={cn(
                    "w-full h-0.5 bg-gray-400 ",
                    step > 1 && "bg-red-400"
                )}
            ></div>
            <StepContent
                isActive={step >= 2 && true}
                stepNumber={2}
                heading="Verify OTP"
            ></StepContent>
            <div
                className={cn(
                    "w-full h-0.5 bg-gray-400 ",
                    step > 2 && "bg-red-400"
                )}
            ></div>
            <StepContent
                isActive={step === 3 && true}
                stepNumber={3}
                heading="Register user"
            ></StepContent>
        </div>
    );
};

export default StepContainer;
