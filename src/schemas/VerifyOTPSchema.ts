import { z } from 'zod';

export const VerifyOTPSchema = () =>
    z.object({
        email: z.string().email("Email không đúng định dạng").min(1, "Vui lòng nhập email"),
        otp: z
            .string()
            .max(6, "Maximun otp charactor is 6")
            .min(6, "OTP charactor is 6"),
    });

export type VerifyOTPFormData = z.infer<ReturnType<typeof VerifyOTPSchema>>;
