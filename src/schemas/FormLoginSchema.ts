import { z } from "zod";
export const LoginSchema = () =>
  z.object({
    username: z
      .string()
      .trim()
      .min(4, "Username phải có ít nhất 4 ký tự")
      .toLowerCase(),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/[a-z]/, { message: "Phải có ít nhất 1 chữ thường" })
      .regex(/[A-Z]/, { message: "Phải có ít nhất 1 chữ in hoa" })
      .regex(/[0-9]/, { message: "Phải có ít nhất 1 chữ số" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Phải có ít nhất 1 ký tự đặc biệt",
      }),
  });

export type LoginFormData = z.infer<ReturnType<typeof LoginSchema>>;
