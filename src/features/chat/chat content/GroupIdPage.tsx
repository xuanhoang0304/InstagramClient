"use client";
import uniqBy from "lodash/uniqBy";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Loading from "@/components/layout/loading";
import NotFound from "@/components/layout/NotFound";
import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { socket } from "@/configs/socket";
import { useApi } from "@/hooks/useApi";
import { handleMutateWithKey } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import { useMessageStore } from "../MessageStore";
import { IGroupResponse, IMessageFE, IMessageResponse } from "../type";
import GroupIdContent from "./GroupIdContent";
import GroupIdHeading from "./GroupIdHeading";
import GroupIdInput from "./GroupIdInput";

const GroupIdPage = () => {
  // --State--
  const { myUser } = useMyStore();
  const {
    messageList,
    msgGroupId,
    setMessageList,
    setMsgGroupId,
    setTargetMessage,
  } = useMessageStore();
  const [msgPage, setMsgPage] = useState(1);
  const [inputWrapperHeight, setInputWrapperHeight] = useState(84);

  // --State--
  const { groupId } = useParams();
  const { data, isLoading } = useApi<IGroupResponse>(
    `${envConfig.BACKEND_URL}/api/groups/${groupId}`,
  );
  const { data: content } = useApi<IMessageResponse>(
    data?.result?._id
      ? `${envConfig.BACKEND_URL}/api/chats/?filters={"groupId":"${groupId}"}&page=${msgPage}&limit=10&sort=createdAt`
      : "",
  );

  // Func

  const handleSetNextPage = (page: number) => {
    setMsgPage(page);
  };
  const handleSetInputWrapperHeight = (height: number) => {
    setInputWrapperHeight(height);
  };

  // Func
  useEffect(() => {
    socket.emit("join-room-chat", String(groupId));
    setMsgGroupId(String(groupId));
  }, [groupId]);

  useEffect(() => {
    if (msgGroupId && msgGroupId !== groupId) {
      setMessageList([]);
      handleMutateWithKey(
        `/chats/?filters={"groupId":"${msgGroupId}"}&page=1&limit=30&sort=createdAt`,
      );
      socket.emit("leave-room-chat", msgGroupId);
      return;
    }
    if (content?.result && msgGroupId === groupId) {
      setMessageList(
        uniqBy([...messageList, ...content?.result?.result], "_id"),
      );
    }
  }, [content, msgGroupId]);
  useEffect(() => {
    socket.on(
      "delete-message",
      (data: { code: number; message: IMessageFE }) => {
        const { code, message } = data;
        if (code === 204) {
          handleMutateWithKey(`/groups/?filter={"userId":"${myUser?._id}"`);
          handleMutateWithKey(
            `/chats/?filters={"groupId":"${groupId}"}&page=${msgPage}&limit=30&sort=createdAt`,
          );
          setMessageList((prev) =>
            prev.filter((msg) => msg._id !== message._id),
          );
          setTargetMessage(null);
        }
      },
    );

    return () => {
      socket.off("delete-message");
    };
  }, [messageList.length]);
  if (isLoading) {
    return (
      <div className="flex-1 w-full h-full relative">
        <div className="w-full h-[77px] p-4 flex items-center justify-between border-primary-gray border-b">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-10 lg:hidden"></Skeleton>
              <Skeleton className="size-11  rounded-full"></Skeleton>
            </div>
            <div>
              <Skeleton className="w-[120px] h-4"></Skeleton>
              <Skeleton className="w-[120px] h-4 mt-1"></Skeleton>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-10"></Skeleton>
            <Skeleton className="size-10"></Skeleton>
          </div>
        </div>
        <div className="relative h-[calc(100vh-160px)] w-full z-10">
          <Loading
            text="Đang tải tin nhắn"
            className="absolute pb-[83px]"
          ></Loading>
        </div>
        <div className="h-[83px] w-full sticky bottom-0 left-0 z-20 p-4 ">
          <Skeleton className="h-[52px] w-full rounded-full "></Skeleton>
        </div>
      </div>
    );
  }
  if (
    !data?.result?._id ||
    !data.result.members.find((u) => u._id === String(myUser?._id))
  ) {
    return <NotFound></NotFound>;
  }

  return (
    <>
      <div className="size-full overflow-hidden relative">
        <GroupIdHeading
          msgPage={msgPage}
          group={data?.result}
          onSetNextPage={handleSetNextPage}
        ></GroupIdHeading>
        <GroupIdContent
          key={groupId as string}
          msgList={messageList}
          page={msgPage}
          group={data?.result}
          totalMessage={Number(content?.result.totalResult)}
          inputWrapperHeight={inputWrapperHeight}
          onSetNextPage={handleSetNextPage}
        ></GroupIdContent>
        <GroupIdInput
          onSetInputWrapperHeight={handleSetInputWrapperHeight}
        ></GroupIdInput>
      </div>
    </>
  );
};

export default GroupIdPage;
