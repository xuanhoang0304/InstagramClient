import { memo } from "react";

import { cn } from "@/lib/utils";

import StepContent from "./StepContent";

const StepContainer = ({ step }: { step: number }) => {
  return (
    <div className="flex mt-4 md:mt-10 flex-row items-center gap-y-6 gap-x-3  justify-between">
      <StepContent isActive={step >= 1 && true} stepNumber={1}></StepContent>
      <div
        className={cn(
          "w-full  h-0.5 bg-gray-400 rotate-0",
          step > 1 && "bg-primary-blue",
        )}
      ></div>
      <StepContent isActive={step >= 2 && true} stepNumber={2}></StepContent>
      <div
        className={cn(
          "w-full  h-0.5 bg-gray-400 rotate-0",
          step > 2 && "bg-primary-blue",
        )}
      ></div>
      <StepContent isActive={step === 3 && true} stepNumber={3}></StepContent>
    </div>
  );
};

export default memo(StepContainer);
