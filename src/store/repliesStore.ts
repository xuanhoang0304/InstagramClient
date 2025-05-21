import { create } from "zustand";
import { IComment } from "@/types/types";

interface RepliesState {
    repliesMap: { [key: string]: IComment[] | [] };
    setReplies: (commentId: string, replies: IComment[] | []) => void;
    resetReplies: () => void;
}

export const useRepliesStore = create<RepliesState>((set) => ({
    repliesMap: {},
    setReplies: (commentId, replies) =>
        set((state) => ({
            repliesMap: {
                ...state.repliesMap,
                [commentId]: replies,
            },
        })),
    resetReplies: () => set({ repliesMap: {} }),
}));
