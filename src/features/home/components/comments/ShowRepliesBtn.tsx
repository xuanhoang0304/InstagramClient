import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";
import { useSearchParams } from "next/navigation";
import { memo, useEffect, useState } from "react";

import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { useRepliesStore } from "@/store/repliesStore";
import { IComment, IPost } from "@/types/types";

import ReplyList from "./ReplyList";

type ShowRepliesBtnProp = {
  parentCmt: IComment;
  post: IPost | null;
  parentCmtList: IComment[];
  listPosts?: IPost[];
  onSetPosts?: (post: IPost[]) => void;
  onSetCmtList: (list: IComment[] | []) => void;
};
const ShowRepliesBtn = ({
  parentCmt,
  post,
  parentCmtList,
  listPosts,
  onSetPosts,
  onSetCmtList,
}: ShowRepliesBtnProp) => {
  const [nextPage, setNextPage] = useState(0);
  const [isShowReplies, setIsShowReplies] = useState(false);
  const { repliesMap, replyInfoMap, setReplies, setReplyInfoMap } =
    useRepliesStore();
  const parentCmtIdParam = useSearchParams().get("parentId");
  const cmtIdParam = useSearchParams().get("commentId");
  const { data } = useApi<{ replies: IComment[] }>(
    nextPage
      ? `${envConfig.BACKEND_URL}/api/comments/${parentCmt._id}/replies?page=${nextPage}&limit=3`
      : "",
  );
  const [isChecked, setIsChecked] = useState(false);

  const handleSetRepleisPage = (page: number) => {
    setNextPage(page);
  };
  const handleBtnShowListClick = () => {
    if (repliesMap[parentCmt._id].length === parentCmt.replies.length) {
      setReplies(parentCmt._id, []);
      setNextPage(0);
      setIsShowReplies(false);
      setReplyInfoMap(parentCmt._id, {
        isShowReplies: false,
        parentId: parentCmt._id,
      });

      return;
    }
    setNextPage((prev) => prev + 1);
    setIsShowReplies(true);
    if (replyInfoMap[parentCmt._id].isShowReplies) return;
    setReplyInfoMap(parentCmt._id, {
      isShowReplies: true,
      parentId: parentCmt._id,
    });
  };
  useEffect(() => {
    if (data && isShowReplies) {
      const newList = uniqBy(
        [...repliesMap[parentCmt._id], ...data.replies],
        "_id",
      );
      setReplies(parentCmt._id, newList);
    }
  }, [data]);
  useEffect(() => {
    setReplies(parentCmt._id, []);
    setReplyInfoMap(parentCmt._id, {
      isShowReplies,
      parentId: parentCmt._id,
    });
    return () => {
      useRepliesStore.getState().resetReplies();
    };
  }, [parentCmt._id]);
  useEffect(() => {
    if (
      !parentCmtIdParam ||
      !cmtIdParam ||
      parentCmt._id !== parentCmtIdParam ||
      isChecked
    )
      return;
    if (isEmpty(repliesMap)) {
      setNextPage(1);
      setIsShowReplies(true);
    } else {
      const cmt = repliesMap[parentCmt._id]?.find(
        (cmt) => cmt._id === cmtIdParam,
      );
      if (!cmt && !nextPage) {
        setNextPage(1);
        setIsShowReplies(true);
        return;
      }
      if (repliesMap[parentCmt._id]) {
        if (repliesMap[parentCmt._id].length) {
          const cmt = repliesMap[parentCmt._id].find(
            (cmt) => cmt._id === cmtIdParam,
          );
          setIsChecked(!!cmt);
          if (cmt) return;
          setNextPage((prev) => prev + 1);
        }
      }
    }
  }, [parentCmtIdParam, cmtIdParam, parentCmt._id, repliesMap]);
  return (
    <>
      {parentCmt.replies.length != 0 && !!Object.entries(repliesMap).length && (
        <button
          onClick={handleBtnShowListClick}
          className="flex items-center mt-1 gap-x-2"
        >
          <div className="h-0.25 w-5 bg-second-gray rounded-full"></div>
          <p className="text-xs text-second-gray">
            {repliesMap[parentCmt._id]?.length >= parentCmt.replies.length
              ? "Ẩn các câu trả lời"
              : `Xem thêm ${
                  parentCmt.replies.length - repliesMap[parentCmt._id]?.length
                } câu trả lời`}
          </p>
        </button>
      )}
      {isShowReplies && Object.entries(repliesMap).length && (
        <ReplyList
          repliesCmt={repliesMap[parentCmt._id]}
          post={post}
          parentCmtList={parentCmtList}
          listPosts={listPosts}
          onSetPosts={onSetPosts}
          onSetCmtList={onSetCmtList}
          onSetRepliesPage={handleSetRepleisPage}
        ></ReplyList>
      )}
    </>
  );
};

export default memo(ShowRepliesBtn);
