/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/configs/axios";
import { IPost, TimeInterval, updatePost, updateUser } from "@/types/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
    } catch (error) {
        console.log("error", error);
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
    } catch (error) {
        console.log("error", error);
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
    } catch (error) {
        console.log("error", error);
    }
}; 
