import { cn } from "@/lib/utils";

type StepContentType = {
  isActive: boolean;
  stepNumber: number;
  heading: string;
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
          "flex items-center justify-center size-10 border-primary-gray border-2  rounded-full group-hover:border-red-400 transition-colors",
          isActive && "border-red-400",
        )}
      >
        <p
          className={cn(
            "font-semibold text-xl group-hover:text-red-400 transition-colors",
            isActive && "text-red-400",
          )}
        >
          {stepNumber}
        </p>
      </div>
      <h2
        className={cn(
          "font-semibold group-hover:text-red-400",
          isActive && "text-red-400",
        )}
      >
        {heading}
      </h2>
    </div>
  );
};

export default StepContent;
