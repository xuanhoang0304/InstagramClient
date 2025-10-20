import isEmpty from "lodash/isEmpty";
import uniqBy from "lodash/uniqBy";
import { useSearchParams } from "next/navigation";
import { memo, useEffect } from "react";

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
  const { replyInfoMap, setReplyInfoMap } = useRepliesStore();

  const cmtIdParam = useSearchParams().get("commentId");
  const parentIdParam = useSearchParams().get("parentId");

  const { data } = useApi<{ replies: IComment[] }>(
    replyInfoMap[parentCmt._id]?.curPage
      ? `${envConfig.BACKEND_URL}/api/comments/${parentCmt._id}/replies?page=${replyInfoMap[parentCmt._id].curPage}&limit=3`
      : "",
  );

  const handleBtnShowListClick = () => {
    if (
      isEmpty(replyInfoMap) === false &&
      replyInfoMap[parentCmt._id]?.parentList?.length === totalCmt
    ) {
      setReplyInfoMap(parentCmt._id, {
        ...replyInfoMap[parentCmt._id],
        isShowReplies: false,
        parentList: [],
        curPage: 0,
      });
      return;
    }
    setReplyInfoMap(parentCmt._id, {
      ...replyInfoMap[parentCmt._id],
      isShowReplies: true,
      curPage: replyInfoMap[parentCmt._id].curPage + 1,
    });
  };
  const totalCmt = parentCmt.replies.length;
  useEffect(() => {
    if (data && data.replies.length && isEmpty(replyInfoMap) === false) {
      const newList = uniqBy(
        [...replyInfoMap[parentCmt._id].parentList, ...data.replies],
        "_id",
      );

      setReplyInfoMap(parentCmt._id, {
        ...replyInfoMap[parentCmt._id],
        parentList: newList,
      });
    }
  }, [data, replyInfoMap[parentCmt._id]?.parentList?.length]);

  useEffect(() => {
    if ((parentIdParam || cmtIdParam) && parentCmt._id === parentIdParam)
      return;
    if (isEmpty(replyInfoMap[parentCmt._id])) {
      setReplyInfoMap(parentCmt._id, {
        parentId: parentCmt._id,
        isShowReplies: false,
        parentList: [],
        curPage: 0,
      });
    }
  }, [parentCmt._id]);

  // UseEffect when notify navigate here
  useEffect(() => {
    if (!parentIdParam || !cmtIdParam || parentCmt._id !== parentIdParam) {
      return;
    }
    if (isEmpty(replyInfoMap[parentCmt._id])) {
      setReplyInfoMap(parentCmt._id, {
        parentId: parentIdParam,
        isShowReplies: parentCmt._id === parentIdParam,
        curPage: 0,
        parentList: [],
      });
      return;
    }
    if (replyInfoMap[parentCmt._id]) {
      const targetCmt = replyInfoMap[parentCmt._id].parentList.find(
        (cmt) => cmt._id === cmtIdParam,
      );
      if (targetCmt?._id || !replyInfoMap[parentCmt._id].isShowReplies) return;
      setReplyInfoMap(parentCmt._id, {
        ...replyInfoMap[parentCmt._id],
        curPage: replyInfoMap[parentCmt._id].curPage + 1,
      });
    }
  }, [
    replyInfoMap[parentCmt._id]?.parentList?.length,
    parentCmt._id,
    parentCmtList.length,
  ]);

  return (
    <>
      <button
        onClick={handleBtnShowListClick}
        className="flex items-center mt-1 gap-x-2"
      >
        <div className="h-0.25 w-5 bg-second-gray rounded-full"></div>
        <p className="text-xs text-second-gray">
          {replyInfoMap[parentCmt._id]?.parentList?.length === totalCmt
            ? "Ẩn các câu trả lời"
            : `Xem thêm ${totalCmt - replyInfoMap[parentCmt._id]?.parentList?.length} câu trả lời`}
        </p>
        {/* replyInfoMap[parentCmt._id]?.parentList?.length >>>> là số câu trả lời đã hiển thị*/}
      </button>
      {!!replyInfoMap[parentCmt._id]?.parentList?.length &&
        replyInfoMap[parentCmt._id]?.isShowReplies && (
          <ReplyList
            repliesCmt={replyInfoMap[parentCmt._id]?.parentList}
            post={post}
            parentCmtList={parentCmtList}
            listPosts={listPosts}
            onSetPosts={onSetPosts}
            onSetCmtList={onSetCmtList}
          ></ReplyList>
        )}
    </>
  );
};

export default memo(ShowRepliesBtn);
