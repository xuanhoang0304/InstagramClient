import { useState } from "react";

import { Media } from "@/components/layout/SideBar/type";
import { cn } from "@/lib/utils";

import { IMessageFE } from "../type";
import { scrollToMessage } from "../utils";
import { MessageActionBtns } from "./MessageActionBtns";
import MessageMedia from "./MessageMedia";

interface Props {
  item: IMessageFE;
  isCurUser: boolean;
  isParent: boolean;
  parentMessage?: IMessageFE;
}
const MessageItem = ({ item, isCurUser, isParent, parentMessage }: Props) => {
  const media: Media[] = [...item.images, ...item.videos];
  const reactionIconMap: Record<string, string> = {
    LIKE: "👍",
    HAHA: "😂",
    SAD: "😢",
    ANGRY: "😣",
    LOVE: "❤️",
    NORMAL: "",
  };
  const [showTxt, setShowTxt] = useState(false);
  const handleShowTxt = () => {
    setShowTxt(!showTxt);
  };
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        if (parentMessage?._id) {
          scrollToMessage(parentMessage._id);
        }
      }}
      className={cn(
        "flex items-center group gap-x-4",
        isCurUser && "flex-row-reverse",
        !isParent && "opacity-60",
      )}
      id={isParent ? item._id : ""}
    >
      <div
        className={cn(
          "flex flex-col relative gap-y-1 w-[70%] md:w-full max-w-fit",
          item.reaction && "pb-3",
          item.parentMessage && "px-3 bg-second-button-background rounded-lg",
        )}
      >
        {item.parentMessage && (
          <MessageItem
            item={item.parentMessage}
            isCurUser={isCurUser}
            isParent={false}
            parentMessage={item.parentMessage}
          ></MessageItem>
        )}
        {item.text && !media.length && (
          <p
            key={item._id}
            className={cn(
              "px-3 min-w-10 py-2 rounded-lg bg-primary-gray max-w-fit whitespace-pre-line break-words w-full",
              isCurUser && "bg-primary-blue self-end",
              !isParent &&
                "bg-primary-gray/50 text-xs max-w-[400px] pb-2 line-clamp-2 ",
              item.text.length > 200 && !isParent && "pb-0",
            )}
          >
            {item.text.length < 200
              ? item.text
              : showTxt
                ? item.text
                : `${item.text.slice(0, 200)}...`}
            <span
              className={cn(
                "hidden text-second-blue ml-1 text-xs font-semibold cursor-pointer",
                item.text.length > 200 && "inline",
                isCurUser && "text-primary-gray",
              )}
              onClick={handleShowTxt}
            >
              {showTxt ? "ẩn bớt" : "xem thêm"}
            </span>
          </p>
        )}
        {!!media.length && (
          <div
            className={cn(
              " flex flex-col py-2",
              item.text &&
                isParent &&
                "p-3 bg-second-button-background rounded-lg",
            )}
          >
            {item.text && isParent && (
              <p
                key={item._id}
                className={cn(
                  "px-3 min-w-10 py-2 rounded-lg  bg-primary-gray max-w-fit whitespace-pre-line break-words w-full",
                  isCurUser && "bg-primary-blue self-end",
                  !isParent &&
                    "bg-primary-gray/50 text-xs max-w-[400px] pb-2 line-clamp-2 ",
                  item.text.length > 200 && !isParent && "pb-0",
                )}
              >
                {item.text.length < 200
                  ? item.text
                  : showTxt
                    ? item.text
                    : `${item.text.slice(0, 200)}...`}
                <span
                  className={cn(
                    "hidden text-primary-gray ml-1 font-semibold cursor-pointer",
                    item.text.length > 200 && "inline",
                    !isCurUser && "text-primary-white",
                  )}
                  onClick={handleShowTxt}
                >
                  {showTxt ? "ẩn bớt" : "xem thêm"}
                </span>
              </p>
            )}
            <MessageMedia
              isCurUser={isCurUser}
              media={media}
              isParent={isParent}
            ></MessageMedia>
          </div>
        )}
        {item.reaction && (
          <p className="bg-primary-gray text-xs max-w-fit whitespace-pre-line break-words w-full  py-0.5 px-2 border border-black rounded-lg absolute z-10 bottom-[0px]">
            {reactionIconMap[item.reaction]}
          </p>
        )}
      </div>
      {isParent && (
        <MessageActionBtns
          message={item}
          isCurUser={isCurUser}
        ></MessageActionBtns>
      )}
    </div>
  );
};

export default MessageItem;
