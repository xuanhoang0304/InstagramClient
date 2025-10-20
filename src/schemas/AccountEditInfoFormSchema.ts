import { z } from "zod";

import { EUserGender } from "@/types/enum";

export const AccountEditInfoFormSchema = () =>
  z.object({
    name: z
      .string()
      .trim()
      .min(3, "Username phải có ít nhất 3 ký tự")
      .regex(/^[a-zA-Z0-9\s_]*$/, "Tên không chứa ký tự đặc biệt"),
    bio: z.string().max(150, "Tiểu sử không được quá 150 ký tự"),
    gender: z.nativeEnum(EUserGender),
  });

export type AccountEditInfoFormData = z.infer<
  ReturnType<typeof AccountEditInfoFormSchema>
>;
