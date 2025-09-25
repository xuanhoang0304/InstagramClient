import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { IComment } from "@/types/types";

interface IReplyInfo {
  parentId: string;
  isShowReplies: boolean;
}
interface RepliesState {
  repliesMap: { [key: string]: IComment[] | [] };
  replyInfoMap: Record<string, IReplyInfo>;
  setReplyInfoMap: (parentId: string, repliesInfo: IReplyInfo) => void;
  setReplies: (commentId: string, replies: IComment[] | []) => void;
  resetReplies: () => void;
}

export const useRepliesStore = create<RepliesState>()(
  devtools((set) => ({
    repliesMap: {},
    replyInfoMap: {},
    setReplyInfoMap: (parentId: string, replyInfoMap: IReplyInfo) =>
      set((state) => ({
        replyInfoMap: {
          ...state.replyInfoMap,
          [parentId]: replyInfoMap,
        },
      })),
    setReplies: (commentId, replies) =>
      set((state) => ({
        repliesMap: {
          ...state.repliesMap,
          [commentId]: replies,
        },
      })),
    resetReplies: () => set({ repliesMap: {} }),
  })),
);
