import { z } from "zod";

export const SendOTPShema = () =>
  z.object({
    email: z
      .string()
      .email("Email không đúng định dạng")
      .min(1, "Vui lòng nhập email"),
  });

export type SendOTPFormData = z.infer<ReturnType<typeof SendOTPShema>>;
