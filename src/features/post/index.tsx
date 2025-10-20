"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import Loading from "@/components/layout/loading";
import NotFound from "@/components/layout/NotFound";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { IPost } from "@/types/types";

import PostModalContent from "../home/components/posts/postModal/PostModalContent";
import SuggesstionPost from "./SuggesstionPost";

const PostPage = ({ postId }: { postId: string }) => {
  const [post, setPost] = useState<IPost | null>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { data, isLoading } = useApi<IPost>(
    `${envConfig.BACKEND_URL}/api/posts/${postId}`,
  );

  const handleSetPostPage = (post: IPost) => {
    setPost(post);
  };
  const router = useRouter();
  useEffect(() => {
    if (data) {
      setPost(data);
    }
    if (isMobile) {
      router.push(`/p/${data?.createdBy._id}?postId=${postId}`);
    }
  }, [data, isMobile]);

  if (isLoading || isMobile) return <Loading></Loading>;
  if (!post) {
    return <NotFound></NotFound>;
  }
  return (
    <div className="mx-auto lg:my-10 my-7 px-3 max-w-[935px]">
      <div className="flex max-h-fit shadow-[0_0_23px_0_rgba(255,255,255,0.2)] rounded-lg">
        <PostModalContent
          item={post}
          onSetNewPost={handleSetPostPage}
        ></PostModalContent>
      </div>
      <div className="my-10 bg-primary-gray h-0.5 w-full"></div>
      <SuggesstionPost post={post}></SuggesstionPost>
    </div>
  );
};

export default PostPage;
