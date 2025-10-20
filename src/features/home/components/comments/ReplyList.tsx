import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IComment, IPost } from "@/types/types";

import ReplyItem from "./ReplyItem";

type ReplyListProps = {
  repliesCmt: IComment[] | [];
  parentCmtList: IComment[];
  post: IPost | null;
  listPosts?: IPost[];
  onSetPosts?: (post: IPost[]) => void;
  onSetCmtList: (list: IComment[] | []) => void;
};
const ReplyList = ({
  repliesCmt,
  post,
  parentCmtList,
  listPosts,
  onSetPosts,
  onSetCmtList,
}: ReplyListProps) => {
  const { targetCmt } = useMyStore();

  if (!repliesCmt?.length) return null;
  return (
    <ul
      className={cn(
        "flex flex-col mt-4 gap-y-4",
        targetCmt?._id && "pb-10 md:pb-0",
      )}
    >
      {repliesCmt &&
        repliesCmt.map((reply) => (
          <ReplyItem
            key={reply._id}
            reply={
              reply as Omit<IComment, "replyCommentId"> & {
                replyCommentId: IComment;
              }
            }
            post={post}
            parentCmtList={parentCmtList}
            replies={repliesCmt}
            listPosts={listPosts}
            onSetPosts={onSetPosts}
            onSetCmtList={onSetCmtList}
          ></ReplyItem>
        ))}
    </ul>
  );
};

export default ReplyList;
