"use client";

import { isEmpty } from "lodash";
import { CircleX, Smile } from "lucide-react";
import { useForm } from "react-hook-form";

import InputForm from "@/app/(noSideBar)/register/components/InputForm";
import { Button } from "@/components/ui/button";
import {
  CommentFormSchema,
  CommentInputFormData,
} from "@/features/home/components/comments/schema/CommentInputSchema";
import {
  cn,
  handleCmtPost,
  handleGetPostByPostId,
  handleMutateWithKey,
  handleReplyCmtPost,
} from "@/lib/utils";
import { useRepliesStore } from "@/store/repliesStore";
import { useMyStore } from "@/store/zustand";
import { IComment, IPost } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";

type CommentInputProps = {
  cmtList?: IComment[];
  post: IPost | null;
  modal?: boolean;
  listPosts?: IPost[];
  onSetPosts?: (posts: IPost[]) => void;
  onSetCmtList?: (list: IComment[] | []) => void;
};
export function CommentInput({
  onSetCmtList,
  post,
  cmtList,
  modal,
  listPosts,
  onSetPosts,
}: CommentInputProps) {
  const { targetCmt, settargetCmt } = useMyStore();
  const { setReplyInfoMap, replyInfoMap } = useRepliesStore();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CommentInputFormData>({
    resolver: zodResolver(CommentFormSchema()),
    defaultValues: {
      content: "",
      postId: post?._id,
    },
  });
  const content = watch("content");

  async function onSubmit(data: CommentInputFormData) {
    // comment in postmodal
    if (cmtList?.length) {
      if (targetCmt?._id) {
        // create reply
        data.replyCommentId = targetCmt._id;
        const parentCmtId = targetCmt.parentCommentId
          ? targetCmt.parentCommentId
          : targetCmt._id;
        const newCmt = (await handleReplyCmtPost(
          parentCmtId,
          data,
        )) as IComment;
        const mutateCmtId = targetCmt.parentCommentId
          ? targetCmt.parentCommentId
          : String(newCmt.parentCommentId);

        handleMutateWithKey(`posts/${post?._id}/comments`);
        handleMutateWithKey(`comments/${mutateCmtId}/replies`);
        handleMutateWithKey(`posts/following`);
        handleMutateWithKey(`posts/discover`);
        const newCmtList = [...cmtList].map((cmt) =>
          cmt._id === mutateCmtId
            ? {
                ...cmt,
                replies: [...cmt.replies, newCmt._id] as string[],
              }
            : cmt,
        );
        const newListPost = listPosts?.map((post) =>
          post._id === String(newCmt.post)
            ? { ...post, comments: [...post.comments, newCmt._id] }
            : post,
        );
        onSetPosts?.(newListPost as IPost[]);
        reset();
        settargetCmt(null);
        onSetCmtList?.(newCmtList);
        if (isEmpty(replyInfoMap[mutateCmtId])) {
          return;
        }
        setReplyInfoMap(mutateCmtId, {
          ...replyInfoMap[mutateCmtId],
          parentList: [...replyInfoMap[mutateCmtId].parentList, newCmt],
        });
        return;
      }
      // create parent comment in post modal
      const newCmt = await handleCmtPost(data);
      if (newCmt?._id) {
        const newList = [...cmtList, newCmt];
        const newPost = await handleGetPostByPostId(newCmt?.post as string);
        const newListPost = listPosts?.map((post) =>
          post._id === newPost?._id ? newPost : post,
        );
        reset();
        onSetPosts?.(newListPost as IPost[]);
        onSetCmtList?.(newList);
        handleMutateWithKey(`posts/${post?._id}/comments`);
        handleMutateWithKey(`posts/following`);
        handleMutateWithKey(`posts/discover`);
        return;
      }
    }
    // create parent comment in postitem
    const newCmt = await handleCmtPost(data);
    const newPost = await handleGetPostByPostId(newCmt?.post as string);
    const newList = listPosts?.map((post) =>
      post._id === newPost?._id ? newPost : post,
    );
    onSetPosts?.(newList as IPost[]);
    reset();
    handleMutateWithKey(`posts/${post?._id}/comments?`);
  }
  return (
    <>
      {targetCmt?._id && (
        <div className="bg-primary-gray font-semibold relative w-full px-2 py-3">
          <p className="text-sm">
            Trả lời bình luận của{" "}
            <span className="text-primary-blue">
              {targetCmt.createdBy.name}
            </span>
          </p>
          <p className="text-second-gray line-clamp-1 italic text-s">
            {targetCmt.content}
          </p>
          <button
            onClick={() => {
              settargetCmt(null);
              setValue("content", "");
            }}
            className="absolute right-2 top-2"
          >
            <CircleX className="text-primary-white size-5"></CircleX>
          </button>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          "w-full flex items-center  gap-x-2 px-2 mt-3 pb-4",
          !modal && "px-0",
        )}
      >
        <Smile
          className={cn(
            "cursor-pointer",
            !modal && "order-3 size-3 text-second-gray",
          )}
        />
        <div className="flex-1">
          <InputForm
            name="content"
            control={control}
            error={errors.content}
            placeholder="Bình luận..."
            isFocus={true && modal}
            className={cn(
              "focus-visible:ring-0 border-none  focus-within:border-none",
              !modal && "px-0",
            )}
          ></InputForm>
        </div>
        <Button
          className={cn(
            "bg-transparent! opacity-100 transition-all text-primary-blue hover:text-second-blue",
            !content && "opacity-0",
          )}
          type="submit"
        >
          Đăng
        </Button>
      </form>
    </>
  );
}
