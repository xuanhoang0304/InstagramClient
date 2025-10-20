"use client";
import uniqBy from "lodash/uniqBy";
import { Film } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMediaQuery } from "usehooks-ts";

import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { tempArr } from "@/lib/utils";
import { usePostStore } from "@/store/postStore";
import { getPostsByCreated, IPost } from "@/types/types";

import UserPostItem from "./UserPostItem";

const UserListReel = () => {
  const { targetPost, resetTargetPost } = usePostStore();
  const [isPC, setIsPC] = useState(false);
  const mediaQuery = useMediaQuery("(min-width: 1025px)");
  const [posts, setPosts] = useState<IPost[] | []>([]);
  const [page, setPage] = useState(1);
  const { userId } = useParams();
  const scrollPositionRef = useRef<number>(0);
  const limit = isPC ? 6 : 9;
  const [loadingMore, setLoadingMore] = useState(false);
  const { data, isLoading } = useApi<getPostsByCreated>(
    `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${userId}"],"isReel":"true"}&limit=${limit}&page=${page}&sorts={ "pinned": -1, "createdAt":-1}`,
  );
  const fetchData = () => {
    setLoadingMore(true);
    scrollPositionRef.current = window.scrollY;
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (data?.result?.length) {
      setPosts((prev) => uniqBy([...prev, ...data.result], "_id"));
      setLoadingMore(false);
    }
  }, [data]);

  useEffect(() => {
    if (targetPost?.post && targetPost.post.isReel) {
      if (targetPost.action === "create") {
        setPosts((prev) => [targetPost.post, ...prev]);
      } else if (targetPost.action === "update") {
        setPosts((prev) =>
          prev.map((item) =>
            item._id === targetPost.post._id ? targetPost.post : item,
          ),
        );
      } else {
        setPosts((prev) =>
          prev.filter((item) => item._id !== targetPost.post._id),
        );
      }
    }
    return () => {
      resetTargetPost();
    };
  }, [targetPost, resetTargetPost]);
  useEffect(() => {
    setIsPC(mediaQuery);
  }, [mediaQuery]);

  if (isLoading && !posts.length) {
    return (
      <div className="grid grid-cols-4 gap-0.5 mt-5">
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
  if (data?.result?.length === 0) {
    return (
      <div className="text-center mt-10">
        <Film className="size-10 mx-auto" />
        <p className="text-3xl font-extrabold mt-2">Không có video</p>
      </div>
    );
  }
  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchData}
      scrollThreshold={0.9}
      className="mt-5"
      hasMore={posts.length < Number(data?.total)}
      loader={
        loadingMore && (
          <div className="grid grid-cols-4 gap-0.5">
            {tempArr.slice(0, 4).map((item) => (
              <Skeleton
                key={item.id}
                className="w-full md:aspect-[3/4] aspect-square rounded-none"
              />
            ))}
          </div>
        )
      }
    >
      <ul className="grid grid-cols-4 gap-0.5 pb-10">
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

export default UserListReel;
