import { cn } from "@/lib/utils";

import StepContent from "./StepContent";

const StepContainer = ({ step }: { step: number }) => {
  return (
    <div className="flex mt-4 md:mt-10 flex-col md:flex-row md:items-center gap-y-6 gap-x-3  md:justify-between">
      <StepContent
        isActive={step >= 1 && true}
        stepNumber={1}
        heading="Nhập email xác thực"
      ></StepContent>
      <div
        className={cn(
          "md:w-full w-9 h-0.5 bg-gray-400 rotate-90 md:rotate-0",
          step > 1 && "bg-red-400",
        )}
      ></div>
      <StepContent
        isActive={step >= 2 && true}
        stepNumber={2}
        heading="Xác thực mã OTP"
      ></StepContent>
      <div
        className={cn(
          "md:w-full w-9 h-0.5 bg-gray-400 rotate-90 md:rotate-0",
          step > 2 && "bg-red-400",
        )}
      ></div>
      <StepContent
        isActive={step === 3 && true}
        stepNumber={3}
        heading="Đăng ký"
      ></StepContent>
    </div>
  );
};

export default StepContainer;
