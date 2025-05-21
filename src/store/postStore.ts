import { create } from 'zustand';

import { IPost } from '@/types/types';

interface PostAction {
    post: IPost;
    action: "create" | "update" | "delete";
}
interface PostState {
    targetPost: PostAction | null;
    setTargetPost: (post: PostAction) => void;
    resetTargetPost: () => void;
}

export const usePostStore = create<PostState>((set) => ({
    targetPost: null,
    setTargetPost: (targetPost: PostAction) => set({ targetPost }),
    resetTargetPost: () => set({ targetPost: null }),
}));
