"use client";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { Heart } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import RealUsername from "@/components/layout/RealUsername";
import { cn, formatNumber, getRelativeTime } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IComment, IPost } from "@/types/types";

import ModalMiniUserProfile from "../posts/miniUser/ModalMiniUserProfile";
import CommentActions from "./CommentActions";
import ShowRepliesBtn from "./ShowRepliesBtn";

type CommentItemProps = {
  cmt: IComment;
  list: IComment[];
  post: IPost | null;
  listPosts?: IPost[];
  onSetPosts?: (posts: IPost[] | []) => void;
  onSetCmtList: (list: IComment[] | []) => void;
};
const CommentItem = ({
  cmt,
  post,
  list,
  listPosts,
  onSetPosts,
  onSetCmtList,
}: CommentItemProps) => {
  const { settargetCmt } = useMyStore();
  const [showFullCmt, setShowFullCmt] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const targetCmtId = useSearchParams().get("commentId");
  const parentId = useSearchParams().get("parentId");
  const sanitizedHTML = useMemo(() => {
    return DOMPurify.sanitize(cmt.content);
  }, [cmt.content]);
  const contentParsed = parse(sanitizedHTML);
  const fullCmt =
    showFullCmt || contentParsed.toString().length < 100
      ? contentParsed
      : contentParsed.toString().slice(0, 100) + "...";
  const isOwner = cmt.createdBy._id === post?.createdBy._id;
  useEffect(() => {
    if (String(parentId ?? targetCmtId) === cmt._id) {
      setShowHighlight(true);
      const cmt = document.getElementById(String(parentId ?? targetCmtId));
      if (cmt) {
        cmt.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      const timer = setTimeout(() => {
        setShowHighlight(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [targetCmtId, cmt._id]);
  return (
    <li
      id={cmt._id}
      className={cn(
        "flex justify-between relative gap-x-4 group p-2 bg-transparent transition-colors",
        showHighlight && " bg-primary-blue/20",
      )}
    >
      <div className="flex flex-1 gap-x-2 ">
        <ModalMiniUserProfile user={cmt.createdBy}></ModalMiniUserProfile>
        <div className="flex-1">
          <div className="text-sm font-semibold flex-wrap max-w-[300px] line-clamp-2 flex items-center gap-x-2 text-primary-white">
            <RealUsername
              username={cmt.createdBy.name}
              isReal={cmt.createdBy.isReal}
            ></RealUsername>
            {isOwner && (
              <span className="italic font-semibold text-second-blue text-xs">
                -tác giả-
              </span>
            )}
            :
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
            <p>{getRelativeTime(String(cmt.createdAt))}</p>
            {cmt.likes.length > 0 && (
              <p className="font-semibold">
                {formatNumber(cmt.likes.length)} lượt thích
              </p>
            )}
            <button
              onClick={() => {
                settargetCmt(cmt);
              }}
              className="font-semibold"
            >
              trả lời
            </button>
            <CommentActions
              cmt={cmt}
              parentCmtList={list}
              isParent
              listPosts={listPosts}
              onSetPosts={onSetPosts}
              onSetCmtList={onSetCmtList}
            ></CommentActions>
          </div>
          {!!cmt.replies.length && (
            <ShowRepliesBtn
              parentCmt={cmt}
              post={post}
              parentCmtList={list}
              listPosts={listPosts}
              onSetPosts={onSetPosts}
              onSetCmtList={onSetCmtList}
            ></ShowRepliesBtn>
          )}
        </div>
      </div>

      <Heart
        onClick={() => {
          alert(cmt._id);
        }}
        className="mt-2 cursor-pointer size-3 text-primary-white"
      />
    </li>
  );
};

export default CommentItem;
