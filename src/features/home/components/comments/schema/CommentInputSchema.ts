import { z } from "zod";
export const CommentFormSchema = () =>
    z.object({
        comment: z
            .string()
            .min(1, {
                message: "Comment không thể để trống",
            })
            .trim()
            .refine(
                (value) => value.length > 0,
                "Comment không thể để trống"
            ),
    });

export type CommentInputFormData = z.infer<
    ReturnType<typeof CommentFormSchema>
>;
