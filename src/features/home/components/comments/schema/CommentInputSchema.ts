import { z } from "zod";
export const CommentFormSchema = () =>
    z.object({
        content: z
            .string()
            .min(1, {
                message: "Comment không thể để trống",
            })
            .trim()
            .refine((value) => value.length > 0, "Comment không thể để trống"),
        postId: z.string().min(24, "Invalid postId").trim(),
    });

export type CommentInputFormData = z.infer<
    ReturnType<typeof CommentFormSchema>
>;
