import { ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";

interface GroupSheetActionProps<T extends (...args: any[]) => any> {
  icon: ReactNode;
  title: string;
  onClick: T;
  classname?: string;
}

function GroupSheetAction<T extends (...args: any[]) => any>({
  icon,
  title,
  onClick,
  classname,
}: GroupSheetActionProps<T>) {
  return (
    <button
      onClick={() => onClick()}
      className={cn(
        "flex items-center bg-primary-gray gap-x-4 last:border-none  w-full px-2 py-4 active:bg-second-button-background hover:bg-second-button-background transition-colors duration-300 border-b border-second-button-background",
        classname,
      )}
    >
      {icon}
      <span className="text-sm font-semibold">{title}</span>
    </button>
  );
}

export default GroupSheetAction;
