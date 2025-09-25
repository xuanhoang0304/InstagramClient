import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { IPost } from "@/types/types";

interface PostAction {
  post: IPost;
  action: "create" | "update" | "delete";
}
interface PostState {
  targetPost: PostAction | null;
  setTargetPost: (post: PostAction) => void;
  resetTargetPost: () => void;
}

export const usePostStore = create<PostState>()(
  devtools((set) => ({
    targetPost: null,
    setTargetPost: (targetPost: PostAction) => set({ targetPost }),
    resetTargetPost: () => set({ targetPost: null }),
  })),
);
