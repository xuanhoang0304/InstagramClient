import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { IMessageFE } from "../type";
import MessageList from "./MessageList";

interface Props {
  isCurUser: boolean;
  group: IMessageFE[];
  isGroup: boolean | undefined;
}
const GroupMessageItem = ({ isCurUser, group, isGroup }: Props) => {
  return (
    <li
      className={cn(
        "flex gap-x-2 h-full max-w-[80%]  md:max-w-[70%] w-full ",
        isCurUser && "justify-items-end flex-row-reverse",
      )}
    >
      {!isCurUser && (
        <Link
          href={`/${group[0].sender._id}`}
          className={cn("shrink-0", group.length > 1 && "self-end")}
        >
          <figure className={cn("size-7 rounded-full ")}>
            <Image
              src={group[0].sender.avatar || "/images/default.jpg"}
              alt="sender avt"
              width={50}
              height={50}
              className="size-full object-cover rounded-full"
            ></Image>
          </figure>
        </Link>
      )}
      <MessageList
        group={group}
        isCurUser={isCurUser}
        isGroup={isGroup}
      ></MessageList>
    </li>
  );
};

export default GroupMessageItem;
