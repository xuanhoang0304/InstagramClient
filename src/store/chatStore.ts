import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { IMessageFE } from "@/features/chat/type";

interface ChatState {
  newMessage: IMessageFE | null;
  setNewMessage: (newMessage: IMessageFE | null) => void;
}

export const useChatStore = create<ChatState>()(
  devtools((set) => ({
    newMessage: null,
    setNewMessage: (newMessage: IMessageFE | null) => set({ newMessage }),
  })),
);
