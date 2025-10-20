import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Heart, Triangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import RealUsername from "@/components/layout/RealUsername";
import { cn, formatNumber, getRelativeTime } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IComment, IPost } from "@/types/types";

import ModalMiniUserProfile from "../posts/miniUser/ModalMiniUserProfile";
import CommentActions from "./CommentActions";

type ReplyItemProps = {
  reply: Omit<IComment, "replyCommentId"> & { replyCommentId: IComment };
  post: IPost | null;
  replies: IComment[];
  parentCmtList: IComment[];
  listPosts?: IPost[];
  onSetPosts?: (post: IPost[]) => void;
  onSetCmtList: (list: IComment[] | []) => void;
};
const ReplyItem = ({
  reply,
  replies,
  parentCmtList,
  post,
  listPosts,
  onSetPosts,
  onSetCmtList,
}: ReplyItemProps) => {
  const { settargetCmt } = useMyStore();
  const [showFullCmt, setShowFullCmt] = useState(false);
  const [isHightlightCmt, setIsHightlightCmt] = useState(false);

  const cmtIdParam = useSearchParams().get("commentId");
  const sanitizedHTML = useMemo(() => {
    return DOMPurify.sanitize(reply.content);
  }, [reply.content]);

  const contentParsed = parse(sanitizedHTML);
  const fullCmt =
    showFullCmt || contentParsed.toString().length < 100
      ? contentParsed
      : contentParsed.toString().slice(0, 100) + "...";
  const isOwner = reply.createdBy._id === post?.createdBy._id;

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
            <RealUsername
              username={reply.createdBy.name}
              isReal={reply.createdBy.isReal}
            ></RealUsername>
            {isOwner && (
              <span className="italic font-semibold text-second-blue text-xs ">
                -tác giả-
              </span>
            )}
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
            ></CommentActions>
          </div>
        </div>
      </div>

      <Heart className="mt-2 cursor-pointer size-3 text-primary-white" />
    </li>
  );
};

export default ReplyItem;
