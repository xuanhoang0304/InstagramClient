import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CommonState {
    isShortSideBar: boolean;
    setIsShortSideBar: (isShortSideBar: boolean) => void;
}

export const useCommonStore = create<CommonState>()(
    devtools((set) => ({
        isShortSideBar: false,
        setIsShortSideBar: (isShortSideBar: boolean) => set({ isShortSideBar }),
    }))
);
