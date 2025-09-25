"use client";
import uniqBy from "lodash/uniqBy";
import { Grid3x3 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "usehooks-ts";

import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { usePostStore } from "@/store/postStore";
import { getPostsByCreated, IPost } from "@/types/types";

import UserPostItem from "./UserPostItem";

const UserListPost = () => {
  const { targetPost, resetTargetPost } = usePostStore();
  const [isPC, setIsPC] = useState(false);
  const mediaQuery = useMediaQuery("(min-width: 1025px)");
  const [posts, setPosts] = useState<IPost[] | []>([]);
  const [page, setPage] = useState(1);
  const { userId } = useParams();
  const scrollPositionRef = useRef<number>(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = isPC ? 6 : 9;
  const postKey = `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${userId}"],"isReel":"false"}&limit=${limit}&page=${page}&sorts={ "pinned": -1, "createdAt":-1}`;
  const { data, isLoading } = useApi<getPostsByCreated>(postKey);

  const fetchData = () => {
    setLoadingMore(true);
    scrollPositionRef.current = window.scrollY;
    setPage((prev) => prev + 1);
  };

  const actionHandlers: Record<
    string,
    (prev: IPost[], post: IPost) => IPost[]
  > = {
    create: (prev, post) => [post, ...prev],
    update: (prev, post) =>
      prev.map((item) => (item._id === post._id ? post : item)),
    delete: (prev, post) => prev.filter((item) => item._id !== post._id),
  };
  const handleTargetPost = useCallback(() => {
    if (!targetPost?.post || targetPost.post.isReel) return;
    const { action, post } = targetPost;
    const handler = actionHandlers[action] || ((prev: IPost[]) => prev);
    setPosts((prev) => {
      if (action === "create" && prev.some((item) => item._id === post._id)) {
        return prev;
      }
      const newPosts = handler(prev, post);
      return uniqBy(newPosts, "_id");
    });
  }, [targetPost, postKey]);

  useEffect(() => {
    if (data?.result?.length) {
      setPosts((prev) => uniqBy([...prev, ...data.result], "_id"));
      setLoadingMore(false);
    }
  }, [data]);
  useEffect(() => {
    handleTargetPost();
    return () => resetTargetPost();
  }, [handleTargetPost, resetTargetPost]);

  useEffect(() => {
    setIsPC(mediaQuery);
  }, [mediaQuery]);
  if (data?.result?.length === 0) {
    return (
      <div className="text-center mt-10">
        <Grid3x3 className="size-10 mx-auto" />
        <p className="text-3xl font-extrabold mt-2">Không có bài viết</p>
      </div>
    );
  }
  if (isLoading && !posts.length) {
    return (
      <div className="grid grid-cols-3 gap-0.5 mt-5">
        {Array(limit)
          .fill(0)
          .map((_, index) => (
            <Skeleton
              key={index}
              className="w-full md:aspect-[3/4] aspect-square rounded-none"
            />
          ))}
      </div>
    );
  }
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchData}
      className="mt-5"
      hasMore={posts.length < Number(data?.total)}
      loader={
        loadingMore && (
          <div className="grid grid-cols-3 gap-0.5">
            {Array(3)
              .fill(0)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="w-full md:aspect-[3/4] aspect-square mt-1 rounded-none"
                />
              ))}
          </div>
        )
      }
    >
      <ul className="grid grid-cols-3 gap-0.5">
        {posts.map((item) => (
          <UserPostItem
            post={item}
            key={item._id}
            imageWrapClass="md:aspect-[3/4]"
          />
        ))}
      </ul>
    </InfiniteScroll>
  );
};

export default UserListPost;
