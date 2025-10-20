import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { IMessageFE } from "./type";

interface Messagestore {
  isNewMessage: boolean;
  targetMessage: IMessageFE | null;
  messageList: IMessageFE[];
  msgGroupId: string | null;
  setIsNewMessage: (newMessage: boolean) => void;
  setTargetMessage: (targetMessage: IMessageFE | null) => void;
  setMessageList: (
    messageList: IMessageFE[] | ((prev: IMessageFE[]) => IMessageFE[]),
  ) => void;
  setMsgGroupId: (msgGroupId: string | null) => void;
}

export const useMessageStore = create<Messagestore>()(
  devtools(
    (set) => ({
      isNewMessage: false,
      targetMessage: null,
      messageList: [],
      msgGroupId: null,
      setIsNewMessage: (isNewMessage: boolean) => set({ isNewMessage }),
      setTargetMessage: (targetMessage: IMessageFE | null) =>
        set({ targetMessage }),
      setMessageList: (
        messageList: IMessageFE[] | ((prev: IMessageFE[]) => IMessageFE[]),
      ) =>
        set((state) => ({
          messageList:
            typeof messageList === "function"
              ? messageList(state.messageList)
              : messageList,
        })),
      setMsgGroupId: (msgGroupId: string | null) => set({ msgGroupId }),
    }),
    {
      name: "MessageStore",
    },
  ),
);
