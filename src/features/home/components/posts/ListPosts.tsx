/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import _ from 'lodash';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { tempArr } from '@/lib/utils';
import { IPost } from '@/types/types';

import PostItems from './PostItems';

const ListPosts = () => {
    const [listPosts, setListPosts] = useState<IPost[]>([]);
    const [flPage, setFlPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [excludes, setExcludes] = useState<string[]>([]);

    const {
        data: following,
        isLoading: isLoadingFollowing,
        mutate: followingMutate,
    } = useApi<any>(
        `${envConfig.BACKEND_URL}/posts/following?sort=createdAt&page=${flPage}&limit=3`,
        {},
        { revalidateOnMount: true }
    );

    const {
        data: explore,
        isLoading: isLoadingExplore,
        mutate: exploreMutate,
    } = useApi<any>(
        `${envConfig.BACKEND_URL}/posts/discover?filters={"excludes": [${excludes}]}&sort=createdAt&limit=3`
    );

    const fetchData = () => {
        if (listPosts.length < following.total) {
            console.log("fetch more following");
            setFlPage((prev) => prev + 1);

            return;
        }
        console.log("fetch more explore");
        setExcludes((prev) => [
            ...prev,
            ...explore.result.map((item: IPost) => `"${item._id}"`),
        ]);
        setListPosts((prev) => [...prev, ...explore.result]);
        if (
            following &&
            explore &&
            listPosts.length === following.total + explore.total
        ) {
            console.log("no more");
            setHasMore(false);
        }
    };

    const handleSetPosts = (post: IPost[] | []) => {
        setListPosts(post);
        followingMutate();
        exploreMutate();
    };
    useEffect(() => {
        if (following && listPosts.length < following.total) {
            const arr = _.uniqBy([...listPosts, ...following.result], "_id");
            setListPosts(arr);
            setHasMore(true);
        }
    }, [following, explore]);

    return (
        <InfiniteScroll
            dataLength={listPosts.length}
            next={fetchData}
            className="mt-5"
            hasMore={hasMore}
            loader={
                (isLoadingFollowing || isLoadingExplore) && (
                    <ul className="flex flex-col gap-y-5 max-w-[468px] mx-auto mt-6">
                        {tempArr.map((item) => (
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
                        ))}
                    </ul>
                )
            }
        >
            <ul className="flex flex-col gap-y-5 max-w-[468px] mx-auto mt-6">
                {isLoadingFollowing && listPosts.length === 0
                    ? tempArr.map((item) => (
                          <li key={item.id}>
                              <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-x-2">
                                      <Skeleton className="size-8 rounded-full cursor-pointer"></Skeleton>
                                      <Skeleton className="w-[130px] h-3"></Skeleton>
                                  </div>
                                  <Skeleton className="size-6"></Skeleton>
                              </div>
                              <Skeleton className="w-[468px] h-[585px] rounded-[4px] mt-3"></Skeleton>
                              <Skeleton className="w-full h-[118px] rounded-[2px] mt-tega1"></Skeleton>
                          </li>
                      ))
                    : listPosts.map((item) => (
                          <PostItems
                              key={item._id}
                              item={item}
                              listPosts={listPosts}
                              onSetPosts={handleSetPosts}
                          />
                      ))}
            </ul>
        </InfiniteScroll>
    );
};

export default ListPosts;
