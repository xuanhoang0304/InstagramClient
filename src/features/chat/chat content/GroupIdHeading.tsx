import "dayjs/locale/vi";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ArrowLeft, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";

import { socket } from "@/configs/socket";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import { useMessageStore } from "../MessageStore";
import { IGroup } from "../type";
import { GroupIdHeadingBtn } from "./GroupIdHeadingBtn";

dayjs.extend(relativeTime);
dayjs.locale("vi");
type Props = {
  msgPage: number;
  group: IGroup | undefined;
  onSetNextPage: (page: number) => void;
};
const GroupIdHeading = ({ msgPage, group, onSetNextPage }: Props) => {
  const { myUser } = useMyStore();
  const { messageList } = useMessageStore();
  const partner = !group?.isGroup
    ? group?.members.find((item) => item._id !== myUser?._id)
    : null;
  const [onlineMembers, setOnlineMembers] = useState<string[] | []>([]);
  const [lastOnlineUser, setLastOnlineUser] = useState<string | null>(null);
  const pathname = usePathname();
  const msgId = useSearchParams().get("msgId");

  const handleCallVideo = () => {
    socket.emit("init-call", { sender: myUser, group });
  };
  useEffect(() => {
    socket.emit("join-room-chat", group?._id);
    if (group?.isGroup === false) {
      socket.emit("last-online-user", {
        userId: partner?._id,
        groupId: group?._id,
      });
    }
    socket.emit("user-online-in-group", group?._id);
    socket.on(
      "user-online-in-group",
      (data: { groupId: string; list: string[] }) => {
        if (data.groupId !== String(group?._id)) return;
        setOnlineMembers(data.list);
      },
    );
    socket.on(
      "last-online-user",
      (data: { userId: string; lastTime: string }) => {
        if (group?.isGroup) return;
        const diffMinutes = dayjs().diff(dayjs(data.lastTime), "minute");
        if (diffMinutes > 1) {
          setLastOnlineUser(data.lastTime);
        }
      },
    );
    return () => {
      socket.off("user-online-in-group");
      socket.off("last-online-user");
    };
  }, []);
  useEffect(() => {
    if (!msgId || messageList.length === 0) return;
    const msg = document.getElementById(`${msgId}`) as HTMLDivElement;
    if (msg) {
      msg.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }
    onSetNextPage(msgPage + 1);
  }, [msgId, messageList]);
  return (
    <header className="flex justify-between items-center px-2 py-4 md:p-4 border-b bg-black border-primary-gray absolute top-0 left-0 right-0 z-10">
      <div className="flex items-center gap-x-2">
        <button
          onClick={() => {
            window.history.back();
          }}
          className="px-2  flex lg:hidden items-center justify-center"
        >
          <ArrowLeft />
        </button>
        <Link
          href={`/${!group?.isGroup ? partner?._id : `chats/${group._id}`}`}
        >
          <figure className="size-11 rounded-full">
            <Image
              src={
                group?.groupAvt ||
                (!group?.isGroup && partner?.avatar) ||
                "/images/default.jpg"
              }
              alt="user chat avt"
              width={100}
              height={100}
              className="size-full object-cover rounded-full"
            ></Image>
          </figure>
        </Link>
        <div>
          <div
            className={cn(
              group?.isGroup === false && "flex items-center gap-x-1",
            )}
          >
            <h2 className="font-semibold line-clamp-1">
              {group?.groupName || (!group?.isGroup && partner?.name)}
            </h2>
            {partner?.isReal && (
              <svg
                aria-label="Đã xác minh"
                className="x1lliihq x1n2onr6 shrink-0"
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
          </div>
          {group?.isGroup ? (
            <p className="text-xs text-second-gray">
              {group.members.length} thành viên
            </p>
          ) : onlineMembers?.length &&
            onlineMembers?.find((user) => user !== String(myUser?._id)) ? (
            <div className="text-xs text-second-gray flex items-baseline gap-x-1">
              <span className="bg-green-500 size-2 inline-block  rounded-full "></span>
              <p>Đang hoạt động</p>
            </div>
          ) : (
            lastOnlineUser && (
              <div className="text-xs text-second-gray flex items-baseline gap-x-1">
                <span className="bg-red-500 size-2 inline-block rounded-full "></span>{" "}
                <p>{`Hoạt động ${dayjs(lastOnlineUser).fromNow()}`}</p>
              </div>
            )
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-2">
        <button
          onClick={handleCallVideo}
          className="size-10 flex items-center justify-center"
        >
          <Phone className="hover:fill-primary-white transition-colors" />
        </button>
        <GroupIdHeadingBtn
          key={`${pathname}?msgId=${msgId}`}
          group={group as IGroup}
        ></GroupIdHeadingBtn>
      </div>
    </header>
  );
};

export default memo(GroupIdHeading);
