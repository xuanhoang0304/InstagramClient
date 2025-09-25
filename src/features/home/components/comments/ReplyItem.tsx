import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Heart, Triangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { cn, formatNumber, getRelativeTime } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IComment, IPost } from "@/types/types";

import ModalMiniUserProfile from "../posts/miniUser/ModalMiniUserProfile";
import { CommentActions } from "./CommentActions";

type ReplyItemProps = {
  reply: Omit<IComment, "replyCommentId"> & { replyCommentId: IComment };
  post: IPost | null;
  replies: IComment[];
  parentCmtList: IComment[];
  listPosts?: IPost[];
  onSetPosts?: (post: IPost[]) => void;
  onSetCmtList: (list: IComment[] | []) => void;
  onSetRepliesPage: (page: number) => void;
};
const ReplyItem = ({
  reply,
  replies,
  parentCmtList,
  post,
  listPosts,
  onSetPosts,
  onSetCmtList,
  onSetRepliesPage,
}: ReplyItemProps) => {
  const { settargetCmt } = useMyStore();
  const sanitizedHTML = useMemo(() => {
    return DOMPurify.sanitize(reply.content);
  }, [reply.content]);
  const contentParsed = parse(sanitizedHTML);
  const [showFullCmt, setShowFullCmt] = useState(false);
  const fullCmt =
    showFullCmt || contentParsed.toString().length < 100
      ? contentParsed
      : contentParsed.toString().slice(0, 100) + "...";
  const isOwner = reply.createdBy._id === post?.createdBy._id;
  const cmtIdParam = useSearchParams().get("commentId");
  const [isHightlightCmt, setIsHightlightCmt] = useState(false);

  useEffect(() => {
    if (cmtIdParam && cmtIdParam === reply._id) {
      const replyE = document.getElementById(cmtIdParam);
      if (replyE) {
        replyE.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setIsHightlightCmt(true);
      const timmer = setTimeout(() => {
        setIsHightlightCmt(false);
      }, 3000);
      return () => clearTimeout(timmer);
    }
  }, []);
  return (
    <li
      id={reply._id}
      className={cn(
        "flex justify-between gap-x-4 group p-1 border border-transparent",
        isHightlightCmt && " border-second-gray",
      )}
    >
      <div className="flex flex-1 gap-x-2">
        <ModalMiniUserProfile user={reply.createdBy}></ModalMiniUserProfile>
        <div className="flex-1">
          <div className="text-sm font-semibold flex-wrap max-w-[300px] line-clamp-2 flex items-center gap-x-2 text-primary-white">
            <h3 className=" whitespace-nowrap flex items-center gap-x-1 ">
              {reply.createdBy.name}
              {isOwner && (
                <span className="italic font-semibold text-second-blue ">
                  tác giả
                </span>
              )}
              {reply.createdBy.isReal && (
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
            </h3>
            <div className="flex items-center gap-x-1">
              <Triangle className="size-3 fill-second-gray stroke-none rotate-90" />
              <h3>{reply.replyCommentId.createdBy.name} : </h3>
            </div>
            <span className="font-normal">
              {fullCmt}
              {contentParsed.toString().length > 100 && (
                <button
                  onClick={() => setShowFullCmt(!showFullCmt)}
                  className="text-xs text-second-gray ml-1"
                >
                  {showFullCmt ? "ẩn bớt" : "xem thêm"}
                </button>
              )}
            </span>
          </div>
          <div className="flex items-center pt-2 text-xs text-second-gray gap-x-2">
            <p>{getRelativeTime(String(reply.createdAt))}</p>
            {reply.likes.length > 0 && (
              <p className="font-semibold">
                {formatNumber(reply.likes.length)} lượt thích
              </p>
            )}
            <button
              onClick={() => {
                settargetCmt(reply);
              }}
              className="font-semibold"
            >
              trả lời
            </button>
            <CommentActions
              cmt={reply}
              isParent={false}
              repliesList={replies}
              parentCmtList={parentCmtList}
              onSetCmtList={onSetCmtList}
              listPosts={listPosts}
              onSetPosts={onSetPosts}
              onSetRepliesPage={onSetRepliesPage}
            ></CommentActions>
          </div>
        </div>
      </div>

      <Heart className="mt-2 cursor-pointer size-3 text-primary-white" />
    </li>
  );
};

export default ReplyItem;
