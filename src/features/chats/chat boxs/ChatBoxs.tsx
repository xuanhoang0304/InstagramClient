"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import ChatBoxsHeading from "./ChatBoxsHeading";
import ChatsList from "./ChatsList";

const ChatBoxs = () => {
  const { myUser } = useMyStore();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "w-full lg:max-w-[397px] lg:pt-9 pt-5 lg:border-r border-primary-gray",
        pathname !== "/chats" && "hidden lg:block",
      )}
    >
      <ChatBoxsHeading></ChatBoxsHeading>
      {myUser?._id ? (
        <figure className="size-[60px] rounded-full mx-6 mt-4">
          <Image
            src={myUser?.avatar || "/images/default.jpg"}
            alt="my user avt"
            width={120}
            height={120}
            className="size-full object-cover rounded-full"
          ></Image>
        </figure>
      ) : (
        <Skeleton className="size-[60px] rounded-full mx-6 mt-4"></Skeleton>
      )}
      {/* Chat box */}
      {myUser?._id ? (
        <div className="flex items-center justify-between font-semibold mt-4 px-6">
          <p>Tin nhắn</p>
          <p className="text-sm text-second-gray">Tin nhắn đang chờ</p>
        </div>
      ) : (
        <div className="mt-4 px-6 w-full lg:w-[396px] h-6">
          <Skeleton className="size-full"></Skeleton>
        </div>
      )}
      <ChatsList></ChatsList>
    </div>
  );
};

export default ChatBoxs;
