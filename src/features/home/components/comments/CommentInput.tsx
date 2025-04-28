"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Smile } from "lucide-react";
import {
    CommentFormSchema,
    CommentInputFormData,
} from "@/features/home/components/comments/schema/CommentInputSchema";
import InputForm from "@/app/register/components/InputForm";
import { cn } from "@/lib/utils";

export function CommentInput() {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<CommentInputFormData>({
        resolver: zodResolver(CommentFormSchema()),
        defaultValues: {
            comment: "",
        },
    });

    function onSubmit(data: CommentInputFormData) {
        toast.success("Success");
        console.log("data", data);
    }

    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full flex items-center gap-x-2 px-2 mt-3 pb-4"
            >
                <Smile />
                <div className="flex-1">
                    <InputForm
                        name="comment"
                        control={control}
                        error={errors.comment}
                        placeholder="Bình luận..."
                    ></InputForm>
                </div>
                <Button className={cn("bg-second-blue text-primary-white hover:bg-primary-blue", errors.comment && "pointer-events-none bg-gray-400 text-primary-gray")} type="submit">Đăng</Button>
            </form>
        </>
    );
}
