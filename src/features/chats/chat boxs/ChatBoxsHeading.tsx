"use client";
import { ArrowLeft, ChevronDown, MessageCirclePlus } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useMyStore } from "@/store/zustand";

import AddGroupsChatBtn from "./AddGroupsChatBtn";

const ChatBoxsHeading = () => {
  const { myUser } = useMyStore();
  return (
    <div className="flex justify-between items-center px-6">
      <div className="flex items-center gap-2">
        {myUser?.name ? (
          <>
            <button
              onClick={() => {
                window.history.back();
              }}
              className="px-2 py-1 flex lg:hidden items-center  justify-center"
            >
              <ArrowLeft />
            </button>
            <h2 className="font-bold text-xl flex items-center gap-x-1">
              {myUser?.name}
              {myUser?.isReal && (
                <svg
                  aria-label="Đã xác minh"
                  className="x1lliihq x1n2onr6"
                  fill="rgb(0, 149, 246)"
                  height="12"
                  role="img"
                  viewBox="0 0 40 40"
                  width="12"
                >
                  <title>Đã xác minh</title>
                  <path
                    d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              )}
            </h2>
            <ChevronDown className="size-5" />
          </>
        ) : (
          <Skeleton className="h-7 w-[200px]"></Skeleton>
        )}
      </div>
      {/* <MessageCirclePlus /> */}
      {myUser?.name ? (
        <AddGroupsChatBtn
          trigger={<MessageCirclePlus></MessageCirclePlus>}
        ></AddGroupsChatBtn>
      ) : (
        <Skeleton className="size-6"></Skeleton>
      )}
    </div>
  );
};

export default ChatBoxsHeading;
