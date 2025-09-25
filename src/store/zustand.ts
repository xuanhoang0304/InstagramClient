/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

/* eslint-disable @typescript-eslint/no-unused-vars */
import { IComment, User } from "@/types/types";

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
  newCmt: IComment | null;
  setNewCmt: (newCmt: IComment | null) => void;
  isCall: boolean;
  setIsCall: (isCall: boolean) => void;
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
        JSON.stringify(state.tokens.refreshToken),
      );
    }
    if (state.tokens?.accessToken !== undefined) {
      localStorage.setItem(
        "accessToken",
        JSON.stringify(state.tokens.accessToken),
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
  devtools(
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
        newCmt: null,
        setNewCmt: (newCmt: IComment | null) => set(() => ({ newCmt })),
        isCall: false,
        setIsCall: (isCall: boolean) => set(() => ({ isCall })),
      }),
      {
        name: "my-store",
        storage: createJSONStorage(() => customStorage),
      },
    ),
  ),
);
