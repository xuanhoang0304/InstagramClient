import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
};

const InputForm = <T extends FieldValues>({
  labelTitle,
  inputId,
  name,
  control,
  error,
  type,
  placeholder,

  className,
}: InputFormType<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <>
          <div className="relative">
            <Input
              {...field}
              id={inputId}
              placeholder={placeholder ? placeholder : ""} // Placeholder rỗng để kích hoạt :placeholder-shown
              className={cn(
                "input-field border-none outline-none !bg-transparent border-gray-400",
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
