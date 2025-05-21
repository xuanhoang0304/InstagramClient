import { z } from "zod";

export const SendOTPShema = () =>
    z.object({
        email: z.string().email("Email invalid"),
    });

export type SendOTPFormData = z.infer<ReturnType<typeof SendOTPShema>>;
