"use client";
import { ArrowDown } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { cn } from "@/lib/utils";

import { useMessageStore } from "../MessageStore";
import { IGroup, IMessageFE } from "../type";
import { handleGroupMessages } from "../utils";
import GroupMessageList from "./GroupMessageList";
import MessageProfile from "./MessageProfile";

type Props = {
  msgList: IMessageFE[];
  page: number;
  totalMessage: number;
  inputWrapperHeight: number;
  group: IGroup | undefined;
  onSetNextPage: (page: number) => void;
};

const GroupIdContent = ({
  msgList,
  page,
  totalMessage,
  group,
  inputWrapperHeight,
  onSetNextPage,
}: Props) => {
  const { isNewMessage, setIsNewMessage } = useMessageStore();
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const [showBtn, setShowBtn] = useState(false);
  const fetchMoreMessage = async () => {
    onSetNextPage(page + 1);
  };
  const handleScroll = useCallback(() => {
    if (showBtn) {
      if (scrollableDivRef.current?.scrollTop === 0) {
        setShowBtn(false);
        return;
      }
      return;
    }
    if ((scrollableDivRef.current?.scrollTop as number) < -100) {
      setShowBtn(true);
    }
  }, [showBtn]);
  const handleScrollToTop = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
  const list = handleGroupMessages(msgList);
  useEffect(() => {
    if (scrollableDivRef.current && isNewMessage) {
      scrollableDivRef.current.scrollTop = 0;
      setIsNewMessage(false);
    }
  }, [isNewMessage, msgList]);

  return (
    <div
      style={{
        height: `calc(100% - ${inputWrapperHeight + 77}px)`,
      }}
      className=" overflow-y-auto absolute top-[77px] left-0  w-full"
    >
      <button
        onClick={handleScrollToTop}
        className={cn(
          "absolute bottom-[70px]  hidden left-1/2  -translate-x-1/2 z-30 bg-primary-gray p-2 rounded-full",
          showBtn && "block",
        )}
      >
        <ArrowDown />
      </button>
      <div
        id="scrollableDiv"
        onScroll={handleScroll}
        ref={scrollableDivRef}
        className={cn(
          "h-full overflow-y-auto overflow-x-hidden relative flex flex-col-reverse pt-6 pb-4 px-3",
          !msgList.length && "flex-col",
        )}
      >
        <InfiniteScroll
          dataLength={msgList.length}
          initialScrollY={20}
          next={fetchMoreMessage}
          inverse={true}
          hasMore={msgList.length < totalMessage}
          loader={null}
          scrollThreshold={0.5}
          scrollableTarget="scrollableDiv"
          className="flex flex-col-reverse gap-y-4 mt-4 overflow-x-hidden!"
        >
          <GroupMessageList
            groupList={list}
            isGroup={group?.isGroup}
          ></GroupMessageList>
        </InfiniteScroll>
        {(msgList.length >= totalMessage || totalMessage === 0) && (
          <MessageProfile group={group}></MessageProfile>
        )}
      </div>
    </div>
  );
};

export default GroupIdContent;
