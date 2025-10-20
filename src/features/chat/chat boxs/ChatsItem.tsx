import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";

import RealUsername from "@/components/layout/RealUsername";
import { socket } from "@/configs/socket";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import { IGroup } from "../type";

interface ChatsItemProps {
  item: IGroup;
}

const ChatsItem = ({ item }: ChatsItemProps) => {
  const router = useRouter();
  const { groupId } = useParams();
  const { myUser } = useMyStore();
  const [onlineMembers, setOnlineMembers] = useState<string[] | []>([]);
  const partner = !item.isGroup
    ? item.members.find((user) => user._id !== myUser?._id)
    : null;
  useEffect(() => {
    socket.emit("user-online-in-group", item._id);
    socket.on(
      "user-online-in-group",
      (data: { groupId: string; list: string[] }) => {
        if (data.groupId !== item._id) return;
        setOnlineMembers(data.list);
      },
    );
    return () => {
      socket.off("user-online-in-group");
    };
  }, [item._id]);

  return (
    <li
      className={cn(
        "flex items-center gap-x-3 px-6 py-2 cursor-pointer hover:bg-second-button-background",
        item._id === groupId && "bg-second-button-background",
      )}
      onClick={() => {
        router.push(`/chats/${item._id}`);
      }}
    >
      <figure className="size-[56px] rounded-full shrink-0 relative">
        <Image
          src={
            item.groupAvt ||
            (!item.isGroup && partner?.avatar) ||
            "/images/default.jpg"
          }
          alt="user avt"
          width={100}
          height={100}
          className="size-full rounded-full object-cover"
        ></Image>
        {onlineMembers?.find((user) => user !== String(myUser?._id)) && (
          <span className="bg-green-500 size-4 absolute bottom-0 right-0 rounded-full border-2 border-black"></span>
        )}
      </figure>
      <div>
        <RealUsername
          username={item.groupName || String(partner?.name)}
          isReal={!!partner?.isReal}
        ></RealUsername>

        {(item.lastMessage?.images.length || item.lastMessage?.videos.length) &&
        !item.lastMessage?.text ? (
          <p className="mt-0.5 text-second-gray text-sm font-semibold">
            {item.lastMessage?.sender.name === String(myUser?.name)
              ? "Bạn"
              : `${item.lastMessage?.sender.name}`}
            : đã gửi file đính kèm
          </p>
        ) : (
          <p className="mt-0.5 text-second-gray text-sm font-semibold">
            {item.lastMessage?.sender.name === String(myUser?.name)
              ? "Bạn "
              : `${item.lastMessage?.sender.name} `}
            :{" "}
            {Number(item.lastMessage?.text.length) > 20
              ? ` ${item.lastMessage?.text.slice(0, 20)}...`
              : ` ${item.lastMessage?.text}`}
          </p>
        )}
      </div>
    </li>
  );
};

export default memo(ChatsItem);
