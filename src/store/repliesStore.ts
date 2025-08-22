import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { IComment } from '@/types/types';

interface RepliesState {
    repliesMap: { [key: string]: IComment[] | [] };
    isShowReplies: boolean;
    setIsShowReplies: (isShowReplies: boolean) => void;
    setReplies: (commentId: string, replies: IComment[] | []) => void;
    resetReplies: () => void;
}

export const useRepliesStore = create<RepliesState>()(
    devtools((set) => ({
        repliesMap: {},
        isShowReplies: false,
        setIsShowReplies: (isShowReplies: boolean) =>
            set(() => ({ isShowReplies })),
        setReplies: (commentId, replies) =>
            set((state) => ({
                repliesMap: {
                    ...state.repliesMap,
                    [commentId]: replies,
                },
            })),
        resetReplies: () => set({ repliesMap: {} }),
    }))
);
