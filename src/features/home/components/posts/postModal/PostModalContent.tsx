import uniqBy from "lodash/uniqBy";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import envConfig from "@/configs/envConfig";
import PostItemHeading from "@/features/home/components/posts/PostItemHeading";
import PostItemMedia from "@/features/home/components/posts/PostItemMedia";
import { useApi } from "@/hooks/useApi";
import { cn } from "@/lib/utils";
import { HttpResponse, IComment, IPost } from "@/types/types";

import { CommentInput } from "../../comments/CommentInput";
import CommentList from "../../comments/CommentList";
import PostButtons from "../PostButtons";

type PostModalContentProps = {
  isModal?: boolean;
  listPosts?: IPost[];
  item: IPost | null;
  onSetPosts?: (posts: IPost[] | []) => void;
  onSetNewPost?: (post: IPost) => void;
};
type getParentCmtByPostId = {
  result: {
    comments: IComment[];
    totalComments: number;
  };
} & HttpResponse;
const PostModalContent = ({
  isModal,
  item,
  listPosts,
  onSetPosts,
  onSetNewPost,
}: PostModalContentProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [commentList, setCommentList] = useState<IComment[] | []>([]);
  const [page, setPage] = useState(1);
  const [totalCmt, setTotalCmt] = useState(0);
  const { data } = useApi<getParentCmtByPostId>(
    `${envConfig.BACKEND_URL}/api/posts/${item?._id}/comments?page=${page}&limit=3`,
  );
  const handleSetCommentist = (list: IComment[] | []) => {
    setCommentList(list);
  };
  const handleSetNextPage = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (data) {
      setCommentList((prev) =>
        uniqBy([...prev, ...data?.result.comments], "_id"),
      );
      setTotalCmt(data?.result.totalComments as number);
    }
  }, [data]);

  return (
    <>
      <PostItemMedia
        className={cn(
          "h-auto rounded-bl-lg !m-0 rounded-tl-lg rounded-tr-none rounded-br-none w-[325px] lg:w-[400px]",
          isModal && "!hidden lg:!block",
        )}
        item={item}
        figureClassName={cn(
          "rounded-none h-full md:w-[325px] lg:w-full",
          isModal && "hidden lg:block",
        )}
        imageClassName="rounded-none block h-full"
        videoClassName={cn(
          "m-0 border-none rounded-tl-lg rounded-bl-lg bg-black lg:w-[400px]  md:w-[325px]",
          isModal && "hidden lg:block",
        )}
      ></PostItemMedia>
      <div
        className={cn(
          " lg:w-[485px] lg:max-w-none  w-full flex-1 h-auto bg-black rounded-tr-lg rounded-br-lg flex shrink-0 flex-col justify-between md:block",
          isModal && "size-full",
        )}
      >
        <div className={cn("", isMobile && "pb-[220px] h-full ")}>
          <PostItemHeading
            isShowTime={false}
            item={item}
            className="p-4"
            modal
          ></PostItemHeading>

          <div
            className={cn(
              "bg-black h-[400px] lg:h-[410px] border-t border-primary-gray overflow-y-auto hidden-scrollbar",
              isModal && "h-[600px]",
              isMobile && "h-full",
            )}
          >
            <CommentList
              post={item}
              parentList={commentList}
              totalCmt={totalCmt}
              listPosts={listPosts}
              onSetNextPage={handleSetNextPage}
              onSetCmtList={handleSetCommentist}
              onSetPosts={onSetPosts}
            ></CommentList>
          </div>
        </div>
        <div className="w-full  border-t rounded-br-lg border-primary-gray bg-black fixed bottom-0 left-0 z-[80] md:static">
          <PostButtons
            item={item}
            modal
            listPosts={listPosts}
            onSetPosts={onSetPosts}
            onSetNewPost={onSetNewPost}
          ></PostButtons>
          <CommentInput
            post={item}
            modal={true} // in post
            cmtList={commentList}
            listPosts={listPosts}
            onSetPosts={onSetPosts}
            onSetCmtList={handleSetCommentist}
          ></CommentInput>
        </div>
      </div>
    </>
  );
};

export default PostModalContent;
