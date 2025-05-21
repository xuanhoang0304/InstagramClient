import { ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient, authClient } from '@/configs/axios';
import {
    CommentInputFormData
} from '@/features/home/components/comments/schema/CommentInputSchema';
import {
    getMe, getParentCmtByPostId, getRepleisResponse, IPost, TimeInterval, updateComment, updatePost,
    updateUser, UploadMedia
} from '@/types/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
export function formatNumber(num: number): string {
    if (!num || num < 0) return "0";
    const units = [
        { threshold: 1_000_000_000, divisor: 1_000_000_000, suffix: "M" },
        { threshold: 1_000_000, divisor: 1_000_000, suffix: "M" },
        { threshold: 1_000, divisor: 1_000, suffix: "N" },
    ];

    for (const unit of units) {
        if (num >= unit.threshold) {
            return `${(num / unit.divisor).toFixed(1)}${unit.suffix}`;
        }
    }

    return num.toString();
}
export function getRelativeTime(isoTime: string): string {
    const inputDate = new Date(isoTime);
    if (isNaN(inputDate.getTime())) {
        return "Invalid ISO time format";
    }
    const now = new Date();
    const diffInSeconds = Math.floor(
        (now.getTime() - inputDate.getTime()) / 1000
    );

    const intervals: TimeInterval[] = [
        { label: "năm", seconds: 31536000 },
        { label: "tháng", seconds: 2592000 },
        { label: "tuần", seconds: 604800 },
        { label: "ngày", seconds: 86400 },
        { label: "giờ", seconds: 3600 },
        { label: "phút", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}`;
        }
    }

    return "vừa xong";
}
export function textWithLinks(input: string) {
    return input
        .replaceAll(`\\n`, "</br>")
        .replaceAll(
            /[^: \n]+:([^ \n]+)/g,
            (match, url) =>
                `<a href="${url}" class="text-primary-blue hover:text-primary-blue-hover" target="_blank">${match}</a>`
        );
}
export const tempArr = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
];

export const handleLikePost = async (post: IPost) => {
    try {
        const data: updatePost = await apiClient.fetchApi(
            `/users/${post._id}/like`,
            {
                method: "PUT",
            }
        );
        return data;
    } catch (error: any) {
        toast.error(error.message);
    }
};
export const handleSavePost = async (post: IPost) => {
    try {
        const data: updatePost = await apiClient.fetchApi(
            `/users/${post._id}/save`,
            {
                method: "PUT",
            }
        );
        return data;
    } catch (error: any) {
        toast.error(error.message);
    }
};
export const handleFollowingUser = async (id: string) => {
    try {
        const data: updateUser = await apiClient.fetchApi(
            `/users/${id}/follow`,
            {
                method: "PUT",
            }
        );
        return data;
    } catch (error: any) {
        toast.error(error.message);
    }
};
export const handleCmtPost = async (data: CommentInputFormData) => {
    try {
        const result: updateComment = await apiClient.fetchApi("/comments/", {
            method: "POST",
            data,
        });
        if (result.code === 201) {
            toast.success("Đã đăng comment!");
            return result.data;
        }
    } catch (error: any) {
        toast.error(error.message);
    }
};
export const handleReplyCmtPost = async (
    parentId: string,
    data: CommentInputFormData
) => {
    try {
        const result: updateComment = await apiClient.fetchApi(
            `comments/${parentId}/reply`,
            {
                method: "POST",
                data,
            }
        );
        if (result.code === 201) {
            toast.success("Đã đăng câu trả lời!");
            return result.data;
        }
    } catch (error: any) {
        toast.error(error.message);
    }
};
export const handleGetRepliesByParentCmtId = async (
    parentId: string,
    page: number
) => {
    try {
        const res: getRepleisResponse = await apiClient.fetchApi(
            `/comments/${parentId}/replies?${page && `page=${page}`}&limit=3`
        );
        if (res.replies.length) {
            return res;
        }
    } catch (error: any) {
        handleError("handleGetRepliesByParentCmtId", error);
    }
};
export const handleGetParentCmtByPostId = async (
    postId: string,
    page: number
) => {
    try {
        const data: getParentCmtByPostId = await apiClient.fetchApi(
            `http://localhost:5000/api/posts/${postId}/comments?page=${page}&limit=3`
        );
        if (data.code) {
            return data.result;
        }
    } catch (error: any) {
        handleError("handleGetParentCmtByPostId", error);
    }
};
export const handleGetMe = async () => {
    try {
        const data: getMe = await authClient.fetchApi("/@me");
        return data;
    } catch (error: any) {
        handleError("handleGetMe", error);
    }
};
export const handleGetPostByPostId = async (postId: string) => {
    try {
        const data: IPost = await apiClient.fetchApi(`/posts/${postId}`);
        return data;
    } catch (error: any) {
        handleError("handleGetPostByPostId", error);
    }
};
export const handleUploadMediaFile = async (
    data: FormData,
    type: "video" | "image"
) => {
    try {
        const response: UploadMedia = await apiClient.fetchApi(
            `upload/${type}`,
            {
                method: "POST",
                data,
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        if (response.data && response.code === 201) {
            return response.data;
        }
        return null;
    } catch (error) {
        handleError("handleUploadMedia", error);
        return null;
    }
};
export const handleDeletePost = async (postId: string) => {
    try {
        const data: updatePost = await apiClient.fetchApi(`/posts/${postId}`, {
            method: "DELETE",
        });
        if (data.code === 204) {
            toast.success("Đã xóa bài viết!");
            return data;
        }
        return null;
    } catch (error: any) {
        handleError("handleDeletePost", error);
    }
};
export const handleError = (id: string, error: any | unknown) => {
    toast.error(error?.message + "id:" + id, {
        duration: 5000,
    });
};
