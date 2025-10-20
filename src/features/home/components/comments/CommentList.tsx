import { CirclePlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import PostCaption from "@/features/home/components/posts/PostCaption";
import { cn } from "@/lib/utils";
import { IComment, IPost } from "@/types/types";

import CommentItem from "./CommentItem";

type CommentListProps = {
  post: IPost | null;
  parentList: IComment[];
  totalCmt: number;
  listPosts: IPost[] | undefined;
  onSetNextPage: () => void;
  onSetPosts?: (posts: IPost[] | []) => void;
  onSetCmtList: (list: IComment[] | []) => void;
};

const CommentList = ({
  post,
  parentList,
  totalCmt,
  listPosts,
  onSetPosts,
  onSetNextPage,
  onSetCmtList,
}: CommentListProps) => {
  const handleLoadMore = () => {
    onSetNextPage();
  };
  const cmtIdParam = useSearchParams().get("commentId");
  const parentIdParam = useSearchParams().get("parentId");

  useEffect(() => {
    if (!cmtIdParam || !parentList.length) return;
    const cmtE = parentList.find(
      (cmt) => cmt._id === (parentIdParam ? parentIdParam : cmtIdParam),
    );
    if (cmtE?._id) return;
    handleLoadMore();
  }, [cmtIdParam, parentList]);
  if (parentList.length === 0) {
    return (
      <div className="h-full p-4 ">
        <PostCaption showAvt item={post}></PostCaption>
        <div className=" flex flex-col h-[90%] items-center gap-y-2 justify-center">
          <p className="text-2xl font-bold">Chưa có bình luận nào</p>
          <p className="text-sm ">Hãy bình luận để tương tác với bài viết</p>
        </div>
      </div>
    );
  }
  return (
    <ul className={cn("px-4 pt-4 pb-10 h-auto  flex flex-col gap-y-3  ")}>
      <PostCaption showAvt item={post}></PostCaption>
      {parentList.map((cmt) => (
        <CommentItem
          key={cmt._id}
          post={post}
          cmt={cmt}
          list={parentList}
          listPosts={listPosts}
          onSetPosts={onSetPosts}
          onSetCmtList={onSetCmtList}
        ></CommentItem>
      ))}

      {/* Load more */}
      {parentList.length < totalCmt && (
        <button
          className="flex items-center justify-center w-full py-1 mt-2 "
          onClick={handleLoadMore}
        >
          <CirclePlus />
        </button>
      )}
    </ul>
  );
};

export default CommentList;
