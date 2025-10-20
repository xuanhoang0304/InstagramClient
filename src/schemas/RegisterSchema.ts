import { z } from "zod";

export const RegisterShema = () =>
  z.object({
    email: z
      .string()
      .email("Email không đúng định dạng")
      .min(1, "Vui lòng nhập email"),
    username: z
      .string()
      .trim()
      .min(4, "Tên đăng nhập phải có ít nhất 4 ký tự")
      .toLowerCase(),
    name: z.string().trim().min(2, "Tên phải có ít nhất 2 ký tự"),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/[a-z]/, { message: "Phải có ít nhất 1 chữ thường" })
      .regex(/[A-Z]/, { message: "Phải có ít nhất 1 chữ in hoa" })
      .regex(/[0-9]/, { message: "Phải có ít nhất 1 chữ số" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Phải có ít nhất 1 ký tự đặc biệt",
      }),
    gender: z.enum(["male", "female", "N/A"]),
    avatar: z
      .any()
      .refine(
        (file) =>
          !file?.length ||
          ["image/jpeg", "image/png", "image/jpg"].includes(file[0]?.type),
        {
          message: "Chỉ cho phép ảnh JPEG, PNG, JPG",
        },
      )
      .optional(),
    phoneNumber: z.string().optional(),
    website: z.string().optional(),
    bio: z.string().optional(),
  });

export type RegisterFormData = z.infer<ReturnType<typeof RegisterShema>>;
