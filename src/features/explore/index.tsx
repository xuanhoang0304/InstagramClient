"use client";
import chunk from "lodash/chunk";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { cn, handleMutateWithKey, tempArr } from "@/lib/utils";
import { getExlorePost, IPost } from "@/types/types";

import ExploreList from "./ExploreList";

const ExplorePage = () => {
  const [excludes, setExcludes] = useState<string[] | []>([]);
  const [oldPosts, setOldPosts] = useState<IPost[] | []>([]);
  const [list, setList] = useState<IPost[][] | []>([]);
  const [total, setTotal] = useState(0);
  const limit = 20;
  const { data, isLoading } = useApi<getExlorePost>(
    `${envConfig.BACKEND_URL}/api/posts/discover?filters={"excludes": [${excludes}]}&limit=${limit}`,
    undefined,
    {
      revalidateOnFocus: false,
    },
  );

  const handleFetchMore = async () => {
    if (data) {
      const excludesId = data.result.map((item) => `"${item._id}"`);
      setExcludes((prev) => [...prev, ...excludesId]);
    }
  };
  const pathname = usePathname();
  useEffect(() => {
    if (data) {
      if (!list?.length) {
        const chunkArr = chunk(data.result, 5);
        setList(chunkArr);
        setOldPosts(data.result);
        setTotal(data.total);
        return;
      }

      const chunkArr = chunk([...oldPosts, ...data.result], 5);
      setList(chunkArr);
      setOldPosts((prev) => [...prev, ...data.result]);
    }
  }, [data]);
  useEffect(() => {
    if (pathname === "/explore") {
      handleMutateWithKey(`/posts/discover?filters={"excludes`);
      setExcludes([]);
      setList([]);
      setOldPosts([]);
    }
  }, [pathname]);
  if (isLoading) {
    return (
      <div className="flex-1 w-full md:py-10 pb-10 flex flex-col gap-0.5">
        {tempArr.slice(0, Math.ceil(limit / 5)).map((item, index) => {
          const isOdd = index % 2 === 0;
          return (
            <div
              key={item.id}
              className={cn(
                "w-full md:w-[90%] lg:w-[80%] mx-auto flex gap-0.5",
                !isOdd && "flex-row-reverse",
              )}
            >
              <Skeleton className="flex-1/3 rounded-none"></Skeleton>
              <div className="grid grid-cols-2 gap-0.5 flex-2/3">
                {tempArr.slice(0, 4).map((i) => (
                  <Skeleton
                    key={i.id}
                    className="aspect-square size-full rounded-none"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  return (
    <>
      <InfiniteScroll
        dataLength={oldPosts.length} //This is important field to render the next data
        next={handleFetchMore}
        hasMore={oldPosts.length < total}
        loader={
          isLoading && (
            <div className="w-full md:w-[90%] lg:w-[80%] mx-auto flex gap-0.5">
              <Skeleton className="flex-1/3 rounded-none"></Skeleton>
              <div className="grid grid-cols-2 gap-0.5 flex-2/3">
                {tempArr.slice(0, 4).map((i) => (
                  <Skeleton
                    key={i.id}
                    className="aspect-square size-full rounded-none"
                  />
                ))}
              </div>
            </div>
          )
        }
        scrollThreshold={"50px"}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        className="flex-1 w-full"
      >
        <ExploreList list={list}></ExploreList>
      </InfiniteScroll>
    </>
  );
};

export default ExplorePage;
