"use client";

import { CircleX, Smile } from "lucide-react";
import { useForm } from "react-hook-form";

import InputForm from "@/app/(noSideBar)/register/components/InputForm";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/configs/axios";
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
  const { targetCmt, setNewCmt, settargetCmt } = useMyStore();
  const { repliesMap, setReplies, replyInfoMap } = useRepliesStore();

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
    if (cmtList?.length) {
      if (targetCmt?._id) {
        const newContet = data.content.replace(
          `@${targetCmt.createdBy.name}`,
          `<a href="/${targetCmt.createdBy._id}" class="text-[#708dff]">@${targetCmt.createdBy.name}</a>`,
        );
        const newData: CommentInputFormData = {
          ...data,
          content: newContet,
          replyCommentId: targetCmt._id,
        };
        const parentCmtId = targetCmt.parentCommentId
          ? targetCmt.parentCommentId
          : targetCmt._id;

        const newCmt = (await handleReplyCmtPost(
          parentCmtId,
          newData,
        )) as IComment;
        const parentCmt: { result: IComment } = await apiClient.fetchApi(
          `/comments/${parentCmtId}`,
        );
        if (!targetCmt.parentCommentId) {
          console.log("reply parent");
          const newList = [...cmtList].map((cmt) =>
            cmt._id === parentCmt.result._id ? parentCmt.result : cmt,
          );
          const newPost = await handleGetPostByPostId(newCmt?.post as string);
          const newListPost = listPosts?.map((post) =>
            post._id === newPost?._id ? newPost : post,
          );
          const isShowReplies = replyInfoMap[parentCmtId]?.isShowReplies;
          const newReplies = !isShowReplies
            ? [...repliesMap[parentCmtId]]
            : [...repliesMap[parentCmtId], newCmt];
          reset();
          handleMutateWithKey(`posts/${post?._id}/comments?`);
          onSetPosts?.(newListPost as IPost[]);
          onSetCmtList?.(newList);
          settargetCmt(null);
          setNewCmt(newCmt);
          setReplies(parentCmtId, newReplies);
          return;
        }
        console.log("rep replies");
        const newList = [...cmtList].map((cmt) =>
          cmt._id === parentCmt.result._id ? parentCmt.result : cmt,
        );
        const newPost = await handleGetPostByPostId(newCmt?.post as string);
        const newListPost = listPosts?.map((post) =>
          post._id === newPost?._id ? newPost : post,
        );
        reset();
        handleMutateWithKey(`posts/${post?._id}/comments?`);
        setReplies(parentCmtId, [...repliesMap[parentCmtId], newCmt]);
        onSetPosts?.(newListPost as IPost[]);
        onSetCmtList?.(newList);
        settargetCmt(null);
        setNewCmt(newCmt);
        return;
      }
      console.log("comment post");
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
        handleMutateWithKey(`posts/${post?._id}/comments?`);
        return;
      }
    }
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
            "bg-second-blue text-primary-white hover:bg-primary-blue",
            errors.content &&
              "pointer-events-none bg-gray-400 text-primary-gray",
            !modal && !content
              ? "hidden"
              : "py-1 px-2 bg-transparent rounded-none hover:bg-transparent text-primary-blue hover:text-primary-blue-hover",
          )}
          type="submit"
        >
          Đăng
        </Button>
      </form>
    </>
  );
}
