/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PostItems from "@/features/home/components/posts/PostItems";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/configs/axios";
import { tempArr } from "@/lib/utils";
import { IPost } from "@/types/types";
import _ from "lodash";
import { useEffect, useState } from "react";
const ListPosts = () => {
    const [listPosts, setListPosts] = useState<IPost[]>([]);
    const handleGetPosts = async () => {
        try {
            const [following, explore]: any = await Promise.all([
                apiClient.fetchApi("/posts/following?sort=createdAt"),
                apiClient.fetchApi("/posts/discover?sort=createdAt"),
            ]);

            const arr = [...following.result, ...explore.result];
            const post: IPost[] = _.uniqBy(arr, "_id");
            setListPosts(post);

            return;
        } catch (error) {
            console.log("error", error);
        }
    };
    const handleSetPosts = (post: IPost) => {
        setListPosts((prev) =>
            prev.map((item) => (item._id === post._id ? post : item))
        );
    };
    useEffect(() => {
        handleGetPosts();
    }, []);

    return (
        <ul className="flex flex-col gap-y-5 max-w-[468px] mx-auto mt-6">
            {listPosts.length
                ? listPosts?.map((item) => (
                      <PostItems
                          key={item._id}
                          item={item}
                          onSetPosts={handleSetPosts}
                      ></PostItems>
                  ))
                : tempArr.map((item) => {
                      return (
                          <li key={item.id}>
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-x-2">
                                      <Skeleton className="size-8 rounded-full cursor-pointer"></Skeleton>

                                      <Skeleton className="w-[130px] h-3"></Skeleton>
                                  </div>
                                  <Skeleton className="size-6"></Skeleton>
                              </div>
                              <Skeleton className="w-[468px] h-[585px] rounded-[4px] mt-3"></Skeleton>
                              <Skeleton className="w-full h-[118px] rounded-[2px] mt-1"></Skeleton>
                          </li>
                      );
                  })}
        </ul>
    );
};

export default ListPosts;
