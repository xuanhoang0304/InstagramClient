import { useEffect, useRef } from "react";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

type InputFormType<T extends FieldValues> = {
  labelTitle?: string;
  inputId?: string;
  name: FieldPath<T>;
  control: Control<T>;
  className?: string;
  error?: {
    message?: string;
  };
  type?: string;
  placeholder?: string;
  isFocus?: boolean;
};

const InputForm = <T extends FieldValues>({
  labelTitle,
  inputId,
  name,
  control,
  error,
  type,
  placeholder,
  isFocus,
  className,
}: InputFormType<T>) => {
  const { targetCmt, newCmt } = useMyStore();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isFocus) {
      if (targetCmt?._id || ref?.current || newCmt?._id) {
        ref.current?.focus();
      }
    }
  }, [targetCmt?._id]);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <div className={cn("relative", error && "mb-4")}>
            <Input
              {...field}
              ref={ref}
              id={inputId}
              autoComplete="off"
              placeholder={placeholder ? placeholder : ""} // Placeholder rỗng để kích hoạt :placeholder-shown
              className={cn(
                "input-field  outline-none !bg-transparent !border-gray-400 rounded-sm ",
                className,
              )}
              type={type}
            />
            <label
              htmlFor={inputId}
              className={cn(
                "input-label text-[#aaa] text-sm absolute left-3 top-1/2 -translate-y-1/2  px-1 bg-[var(--bg-second-white)] dark:bg-primary-bgcl",
              )}
            >
              {labelTitle?.replace(labelTitle[0], labelTitle[0].toUpperCase())}
            </label>
            {error && (
              <p className="text-red-500 text-xs absolute mt-1">
                {error.message}
              </p>
            )}
          </div>
        </>
      )}
    />
  );
};

export default InputForm;
