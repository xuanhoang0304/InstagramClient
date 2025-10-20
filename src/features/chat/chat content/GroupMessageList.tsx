import dayjs from "dayjs";

import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import { IMessageFE } from "../type";
import { getTimeDifference } from "../utils";
import GroupMessageItem from "./GroupMessageItem";

interface Props {
  groupList: IMessageFE[][];
  isGroup: boolean | undefined;
}
const GroupMessageList = ({ groupList, isGroup }: Props) => {
  const { myUser } = useMyStore();

  return (
    <>
      {groupList.map((group, index) => {
        const isCurUser = group[0].sender._id === myUser?._id;
        const timeDif =
          index < groupList.length - 1
            ? getTimeDifference(
                String(groupList[index][0].createdAt),
                String(groupList[index + 1][0].createdAt),
              )
            : 0;
        return (
          <ul
            key={group[0]._id}
            className={cn(
              `md:w-full  flex flex-col gap-y-5`,
              isCurUser && "items-end",
            )}
          >
            {(timeDif > 15 || timeDif === 0) && (
              <p className="self-center text-second-gray text-xs font-semibold">
                <span className="text-[10px] mr-1">
                  {dayjs(String(group[0].createdAt)).format("H:mm")}
                </span>
                {dayjs(String(group[0].createdAt)).format("DD/MM/YYYY")}
              </p>
            )}

            <GroupMessageItem
              isCurUser={isCurUser}
              isGroup={isGroup}
              group={group}
            ></GroupMessageItem>
          </ul>
        );
      })}
    </>
  );
};

export default GroupMessageList;
