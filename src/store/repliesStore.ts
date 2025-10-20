import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { IComment } from "@/types/types";

interface IReplyInfo {
  parentId: string;
  isShowReplies: boolean;
  parentList: IComment[];
  curPage: number;
}
interface RepliesState {
  replyInfoMap: Record<string, IReplyInfo>;
  setReplyInfoMap: (parentId: string, repliesInfo: IReplyInfo) => void;
  resetReplyInfoMap: () => void;
}

export const useRepliesStore = create<RepliesState>()(
  devtools((set) => ({
    replyInfoMap: {},
    setReplyInfoMap: (parentId: string, replyInfoMap: IReplyInfo) =>
      set((state) => ({
        replyInfoMap: {
          ...state.replyInfoMap,
          [parentId]: replyInfoMap,
        },
      })),
    resetReplyInfoMap: () =>
      set(() => ({
        replyInfoMap: {},
      })),
  })),
);
