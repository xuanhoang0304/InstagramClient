import { useSearchParams } from "next/navigation";
import { memo, RefObject, useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import PostCaption from "@/features/home/components/posts/PostCaption";
import PostItemHeading from "@/features/home/components/posts/PostItemHeading";
import PostItemMedia from "@/features/home/components/posts/PostItemMedia";
import { PostProp } from "@/features/home/components/posts/type";
import { cn } from "@/lib/utils";
import { IPost } from "@/types/types";

import { CommentInput } from "../comments/CommentInput";
import MobileCmtDrawer from "../comments/moblie/MobileCmtDrawer";
import PostButtons from "./PostButtons";
import PostModal from "./postModal/PostModal";
import PostModalContent from "./postModal/PostModalContent";

type PostItemsProps = {
  onSetPosts: (post: IPost[] | []) => void;
  PostRef?: RefObject<HTMLLIElement | null> | undefined;
  listPosts: IPost[];
} & PostProp;
const PostItems = ({
  item,
  onSetPosts,
  listPosts,
  PostRef,
}: PostItemsProps) => {
  const [showModal, setShowModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const postIdParam = useSearchParams().get("postId");
  const [highlightPost, setHighlightPost] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
    window.history.pushState({}, "", `/post/${item?._id}`);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    window.history.pushState({}, "", "/");
  };
  useEffect(() => {
    if (postIdParam) {
      setHighlightPost(postIdParam === String(item?._id));
      const timer = setTimeout(() => {
        setHighlightPost(false);
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);
  return (
    <li
      id={`${item?._id}`}
      ref={PostRef}
      className={cn(
        "p-2",
        PostRef && "scroll-mt-[74px]",
        highlightPost && "bg-primary-blue/20",
      )}
    >
      {/* heading */}
      <PostItemHeading isShowTime item={item} modal={false}></PostItemHeading>
      {/* Media */}
      <PostItemMedia
        item={item}
        className="mt-3"
        figureClassName="w-full !rounded-lg md:!h-[585px]"
        imageClassName="!rounded-lg"
        videoClassName="w-full rounded-lg md:h-[585px] !border-none"
      ></PostItemMedia>
      {/*Post Buttons */}
      <PostButtons
        item={item}
        modal={false}
        listPosts={listPosts}
        onSetPosts={onSetPosts}
      ></PostButtons>

      <div className="flex items-center gap-x-2">
        {item?.likes.length ? (
          <p className="text-sm font-semibold">
            {parseInt(item.likes.length.toString())
              .toLocaleString("vi-VN")
              .replace(/,/g, ".")}{" "}
            lượt thích
          </p>
        ) : null}
        {item?.savedBy.length ? (
          <p className="text-sm font-semibold">
            {parseInt(item.likes.length.toString())
              .toLocaleString("vi-VN")
              .replace(/,/g, ".")}{" "}
            lưu lại
          </p>
        ) : null}
      </div>
      {/* Caption */}
      <PostCaption item={item}></PostCaption>
      {/* Comments */}
      {item?.comments.length ? (
        <button
          onClick={handleOpenModal}
          className="text-xs hidden md:block text-second-gray"
        >
          Xem thêm {item?.comments.length} bình luận
        </button>
      ) : null}
      {!isMobile && showModal && (
        <PostModal
          Content={
            <PostModalContent
              item={item}
              listPosts={listPosts}
              onSetPosts={onSetPosts}
              isModal
            ></PostModalContent>
          }
          onCloseModal={handleCloseModal}
        ></PostModal>
      )}
      <MobileCmtDrawer
        triger={
          item?.comments.length ? (
            <div className="text-xs mt-1 md:hidden text-second-gray">
              Xem thêm {item?.comments.length} bình luận
            </div>
          ) : null
        }
        post={item}
        onSetPosts={onSetPosts}
      ></MobileCmtDrawer>
      {/* Cmt Input */}
      <CommentInput
        modal={false}
        post={item}
        listPosts={listPosts}
        onSetPosts={onSetPosts}
      ></CommentInput>
    </li>
  );
};

export default memo(PostItems);
