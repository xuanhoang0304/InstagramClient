/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { IComment, User } from "@/types/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ITokens {
    refreshToken: string;
    accessToken: string;
}

export type Store = {
    tokens: ITokens | null;
    setToken: (tokens: ITokens) => void;
    myUser: User | null;
    setMyUser: (user: User | null) => void;
    targetCmt: IComment | null;
    settargetCmt: (targetCmtId: IComment | null) => void;
};

const customStorage = {
    getItem: async (name: string) => {
        const refreshToken = localStorage.getItem("refreshToken") || '""';
        const accessToken = localStorage.getItem("accessToken") || '""';
        const myUser = localStorage.getItem("user") || "null";
        return JSON.stringify({
            state: {
                tokens: {
                    refreshToken: JSON.parse(refreshToken),
                    accessToken: JSON.parse(accessToken),
                },
                myUser: JSON.parse(myUser),
            },
            version: 0,
        });
    },
    setItem: async (name: string, value: string) => {
        const { state } = JSON.parse(value);
        if (state.tokens?.refreshToken !== undefined) {
            localStorage.setItem(
                "refreshToken",
                JSON.stringify(state.tokens.refreshToken)
            );
        }
        if (state.tokens?.accessToken !== undefined) {
            localStorage.setItem(
                "accessToken",
                JSON.stringify(state.tokens.accessToken)
            );
        }
        if (state.myUser !== undefined) {
            localStorage.setItem("user", JSON.stringify(state.myUser));
        }
    },
    removeItem: async (name: string) => {
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
    },
};

export const useMyStore = create<Store>()(
    persist(
        (set) => ({
            tokens: {
                refreshToken: "",
                accessToken: "",
            },
            setToken: (tokens: ITokens) => set(() => ({ tokens })),
            myUser: null,
            setMyUser: (myUser: User | null) => set(() => ({ myUser })),
            targetCmt: null,
            settargetCmt: (targetCmt: IComment | null) =>
                set(() => ({ targetCmt })),
        }),
        {
            name: "my-store",
            storage: createJSONStorage(() => customStorage),
        }
    )
);
