/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import uniqBy from "lodash/uniqBy";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import MobileHeaderListPost from "@/components/layout/MobileHeaderListPost";
import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { tempArr } from "@/lib/utils";
import { IPost } from "@/types/types";

import FollowMoreUser from "../FollowMoreUser";

const PostItems = dynamic(() => import("./PostItems"), {
  loading: () => (
    <>
      <MobileHeaderListPost></MobileHeaderListPost>
      <ul className="flex flex-col gap-y-5 max-w-[468px] ">
        {tempArr.map((item) => (
          <li key={item.id} className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                <Skeleton className="size-8 rounded-full cursor-pointer"></Skeleton>
                <Skeleton className="w-[130px] h-3"></Skeleton>
              </div>
              <Skeleton className="size-6"></Skeleton>
            </div>
            <Skeleton className="w-full md:w-[468px] md:h-[585px] aspect-square rounded-lg mt-3"></Skeleton>
            <Skeleton className="w-full h-[118px] mt-1 rounded-[2px] mt-tega1"></Skeleton>
          </li>
        ))}
      </ul>
    </>
  ),
});
const ListPosts = () => {
  const [listPosts, setListPosts] = useState<IPost[]>([]);
  const [flPage, setFlPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [excludes, setExcludes] = useState<string[]>([]);

  const { data: following, isLoading: isLoadingFollowing } = useApi<any>(
    `${envConfig.BACKEND_URL}/api/posts/following?sort=createdAt&page=${flPage}&limit=3`,
  );

  const { data: explore, isLoading: isLoadingExplore } = useApi<any>(
    `${envConfig.BACKEND_URL}/api/posts/discover?filters={"excludes": [${excludes}]}&sort=createdAt&limit=3`,
  );

  const fetchData = () => {
    if (listPosts.length < following.total) {
      // console.log("fetch more following");
      setFlPage((prev) => prev + 1);

      return;
    }
    // console.log("fetch more explore");
    setExcludes((prev) => [
      ...prev,
      ...explore.result.map((item: IPost) => `"${item._id}"`),
    ]);
    setListPosts((prev) => uniqBy([...prev, ...explore.result], "_id"));
    if (
      following &&
      explore &&
      listPosts.length === following.total + explore.total
    ) {
      // console.log("no more");
      setHasMore(false);
    }
  };

  const handleSetPosts = (post: IPost[] | []) => {
    setListPosts(post);
  };

  useEffect(() => {
    if (following && listPosts.length < following.total) {
      const arr = uniqBy([...listPosts, ...following.result], "_id");
      setListPosts(arr);
      setHasMore(true);
    }
  }, [following, explore]);
  if ((isLoadingFollowing || isLoadingExplore) && !listPosts.length) {
    return (
      <>
        <MobileHeaderListPost></MobileHeaderListPost>
        <ul className="flex flex-col gap-y-5 max-w-[468px] mx-auto mt-5 lg:mt-11">
          {tempArr.map((item) => (
            <li key={item.id} className="p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                  <Skeleton className="size-8 rounded-full cursor-pointer"></Skeleton>
                  <Skeleton className="w-[130px] h-3"></Skeleton>
                </div>
                <Skeleton className="size-6"></Skeleton>
              </div>
              <Skeleton className="w-full md:w-[468px] md:h-[585px] aspect-square rounded-lg mt-3"></Skeleton>
              <Skeleton className="w-full h-[118px] mt-1 rounded-[2px] mt-tega1"></Skeleton>
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (!listPosts?.length) {
    return <FollowMoreUser></FollowMoreUser>;
  }
  return (
    <>
      <MobileHeaderListPost></MobileHeaderListPost>
      <InfiniteScroll
        dataLength={listPosts.length}
        next={fetchData}
        hasMore={hasMore}
        scrollThreshold={0.9}
        loader={
          (isLoadingFollowing || isLoadingExplore) && (
            <ul className="flex flex-col gap-y-5 max-w-[468px] mx-auto mt-5 lg:mt-11">
              {tempArr.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <Skeleton className="size-8 rounded-full cursor-pointer"></Skeleton>
                      <Skeleton className="w-[130px] h-3"></Skeleton>
                    </div>
                    <Skeleton className="size-6"></Skeleton>
                  </div>
                  <Skeleton className="w-full md:w-[468px] md:h-[585px] aspect-square rounded-lg mt-3"></Skeleton>
                  <Skeleton className="w-full h-[118px] mt-1 rounded-[2px] mt-tega1"></Skeleton>
                </li>
              ))}
            </ul>
          )
        }
      >
        <ul className="flex flex-col gap-y-5 md:max-w-[468px] mx-auto mt-5 lg:mt-11">
          {listPosts.map((item) => (
            <PostItems
              key={item._id}
              item={item}
              listPosts={listPosts}
              onSetPosts={handleSetPosts}
            />
          ))}
        </ul>
      </InfiniteScroll>
    </>
  );
};

export default ListPosts;
