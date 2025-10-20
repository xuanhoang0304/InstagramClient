"use client";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { tempArr } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { useMyStore } from "@/store/zustand";
import { HttpResponse } from "@/types/types";

import { IGroup } from "../type";
import ChatsItem from "./ChatsItem";

interface GetIGroupResponse extends HttpResponse {
  result: {
    result: IGroup[];
    totalResult: number;
  };
}
const ChatsList = () => {
  const { myUser } = useMyStore();
  const { newMessage, setNewMessage } = useChatStore();
  const [list, setList] = useState<IGroup[] | []>([]);
  const { data, isLoading } = useApi<GetIGroupResponse>(
    myUser?._id
      ? `${envConfig.BACKEND_URL}/api/groups/?filter={"userId":"${myUser?._id}"}&sort=updatedAt&order=DESC`
      : "",
  );

  useEffect(() => {
    if (data) {
      setList(data.result.result);
    }
  }, [data]);

  useEffect(() => {
    if (newMessage?._id) {
      const newList = [...list].map((group) =>
        group._id === newMessage.groupId
          ? {
              ...group,
              lastMessage: newMessage,
            }
          : group,
      );
      setList(newList);
      setNewMessage(null);
    }
  }, [list, newMessage]);
  if (!myUser?._id || (isLoading && !list.length)) {
    return (
      <ul className="flex flex-col w-full gap-y-0.5 mt-2  ">
        {tempArr.slice(0, 10).map((item) => (
          <li key={item.id} className="flex items-center gap-x-3 px-6 py-2">
            <Skeleton className="size-[56px] rounded-full shrink-0"></Skeleton>
            <div className="w-full">
              <Skeleton className="w-full h-4"></Skeleton>
              <Skeleton className="w-full h-4 mt-2"></Skeleton>
            </div>
          </li>
        ))}
      </ul>
    );
  }
  if (!isLoading && list.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Không có cuộc hội thoại nào</p>
      </div>
    );
  }
  return (
    <ul className="flex flex-col gap-y-0.5 mt-2 h-[calc(100vh-200px)] overflow-y-auto hidden-scrollbar transition-opacity ">
      {list.map((item) => {
        return <ChatsItem item={item} key={item._id}></ChatsItem>;
      })}
    </ul>
  );
};

export default ChatsList;
