import { Ellipsis } from "lucide-react";
import { RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { useOnClickOutside } from "usehooks-ts";

import { apiClient } from "@/configs/axios";
import {
  handleError,
  handleGetPostByPostId,
  handleMutateWithKey,
} from "@/lib/utils";
import { useRepliesStore } from "@/store/repliesStore";
import { useMyStore } from "@/store/zustand";
import { IComment, IPost, updateComment } from "@/types/types";

type CommentActions = {
  cmt: IComment;
  parentCmtList: IComment[];
  repliesList?: IComment[];
  isParent: boolean;
  listPosts?: IPost[];
  onSetCmtList: (list: IComment[] | []) => void;
  onSetPosts?: (posts: IPost[] | []) => void;
  onSetRepliesPage?: (page: number) => void;
};

export function CommentActions({
  cmt,
  isParent,
  parentCmtList,
  repliesList,
  listPosts,
  onSetCmtList,
  onSetPosts,
  onSetRepliesPage,
}: CommentActions) {
  const { myUser } = useMyStore();
  const { setReplies } = useRepliesStore();
  const [isShow, setIsShow] = useState(false);
  const [showConfirm, setShowComfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const handleClose = () => {
    setIsShow(false);
  };
  const handleCloseConfirmModal = () => {
    setShowComfirm(false);
  };
  const handleDeleteCmt = async (cmtId: string) => {
    try {
      const result: updateComment = await apiClient.fetchApi(
        `/comments/${cmtId}`,
        {
          method: "DELETE",
        },
      );
      if (result.code === 204) {
        toast.success("Đã xóa comment thành công!");
        if (isParent && parentCmtList) {
          // console.log("delete parent");
          const newList = [...parentCmtList].filter(
            (cmt) => cmt._id !== result.data._id,
          );
          const newPost = await handleGetPostByPostId(
            result.data.post as string,
          );
          if (listPosts && listPosts.length) {
            const newListPost = listPosts.map((post) =>
              post._id === newPost?._id ? newPost : post,
            );
            onSetPosts?.(newListPost);
          }
          onSetCmtList?.(newList);
          setReplies(String(result.data.parentCommentId), newList);
          handleMutateWithKey(`posts/${result.data.post}/comments?`);
          return;
        }
        if (repliesList) {
          // console.log("delete replies");
          const newList = [...repliesList].filter((cmt) => cmt._id !== cmtId);
          setReplies(String(cmt.parentCommentId), newList);
          const parentCmt: { result: IComment } = await apiClient.fetchApi(
            `/comments/${result.data.parentCommentId}`,
          );

          const newParentList = [...parentCmtList].map((cmt) =>
            cmt._id === parentCmt.result._id ? parentCmt.result : cmt,
          );
          onSetCmtList?.(newParentList);

          const newPost = await handleGetPostByPostId(
            result.data.post as string,
          );
          if (listPosts && listPosts.length) {
            const newListPost = listPosts.map((post) =>
              post._id === newPost?._id ? newPost : post,
            );
            onSetPosts?.(newListPost);
          }
          onSetRepliesPage?.(1);
        }
        setIsShow(false);
        handleMutateWithKey(`posts/${result.data.post}/comments?`);
      }
    } catch (error) {
      handleError("handleDeleteCmt-CommentAction", error);
    }
  };
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
  useOnClickOutside(
    confirmRef as RefObject<HTMLDivElement>,
    handleCloseConfirmModal,
  );
  return (
    <>
      <Ellipsis
        onClick={() => setIsShow(true)}
        className="cursor-pointer size-6 lg:opacity-0 group-hover:opacity-100"
      />
      {isShow && (
        <div className="bg-black/80 fixed inset-0 z-[100] flex items-center justify-center">
          {!showConfirm ? (
            <div
              ref={ref}
              className="sm:max-w-[400px] w-full dark:!bg-[#262626] bg-primary-gray flex p-0 flex-col gap-y-0 font-semibold text-sm text-center"
            >
              {cmt.createdBy._id === myUser?._id ? (
                <>
                  <button
                    onClick={() => {
                      setShowComfirm(true);
                    }}
                    className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid"
                  >
                    Xóa bình luận
                  </button>
                  <button
                    onClick={() => {}}
                    className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid"
                  >
                    Sửa bình luận
                  </button>
                </>
              ) : (
                <button className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid">
                  Báo cáo
                </button>
              )}

              <button
                onClick={() => setIsShow(false)}
                className="px-2 py-[14px]"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div
              ref={confirmRef}
              className="bg-primary-gray max-w-[300px] py-2 px-4 rounded-lg"
            >
              <h3 className="text-xl font-bold">Xóa bình luận</h3>
              <p className="mt-1 italic">
                Bạn có chăc chắn muốn xóa bình luận này?
              </p>
              <div className="flex items-center justify-between mt-2 font-bold gap-x-4">
                <button
                  onClick={() => setShowComfirm(false)}
                  className="px-4 py-1 transition-colors hover:opacity-70"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDeleteCmt(cmt._id)}
                  className="px-1 py-[14px] hover:opacity-70 transition-colors text-[#ed4956]"
                >
                  Xóa bình luận
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
