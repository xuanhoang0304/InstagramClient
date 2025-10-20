import { memo } from "react";

import { cn } from "@/lib/utils";

type StepContentType = {
  isActive: boolean;
  stepNumber: number;
  heading?: string;
  onSetStep?: (step: number) => void;
};
const StepContent = ({
  isActive,
  heading,
  stepNumber,
  onSetStep,
}: StepContentType) => {
  return (
    <div
      onClick={() => onSetStep?.(stepNumber)}
      className="flex items-center gap-x-3 shrink-0  group"
    >
      <div
        className={cn(
          "flex items-center justify-center size-10 border-primary-gray border-2  rounded-full group-hover:border-primary-blue transition-colors",
          isActive && "border-primary-blue",
        )}
      >
        <p
          className={cn(
            "font-semibold text-xl group-hover:text-primary-blue transition-colors",
            isActive && "text-primary-blue",
          )}
        >
          {stepNumber}
        </p>
      </div>
      {heading && (
        <h2
          className={cn(
            "font-semibold group-hover:text-primary-blue",
            isActive && "text-primary-blue",
          )}
        >
          {heading}
        </h2>
      )}
    </div>
  );
};

export default memo(StepContent);
