"use client";
import _, { debounce } from 'lodash';
import { Film } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mutate } from 'swr';
import { useMediaQuery } from 'usehooks-ts';

import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { usePostStore } from '@/store/postStore';
import { getPostsByCreated, IPost } from '@/types/types';

import UserPostItem from './UserPostItem';

const UserListReel = () => {
    const { targetPost, resetTargetPost } = usePostStore();
    const [isPC, setIsPC] = useState(false);
    const mediaQuery = useMediaQuery("(min-width: 1025px)");
    const [posts, setPosts] = useState<IPost[] | []>([]);
    const [page, setPage] = useState(1);
    const { userId } = useParams();
    const scrollPositionRef = useRef<number>(0);
    const limit = isPC ? 6 : 9;
    const reelKey = `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${userId}"],"isReel":"true"}&limit=${limit}&page=${page}&sorts={ "pinned": -1, "createdAt":-1}`;
    const { data, isLoading } = useApi<getPostsByCreated>(reelKey);

    const fetchData = debounce(() => {
        scrollPositionRef.current = window.scrollY;
        setPage((prev) => prev + 1);
    }, 500);

    useEffect(() => {
        if (data?.result?.length) {
            setPosts((prev) => _.uniqBy([...prev, ...data.result], "_id"));
        }
    }, [data]);
    useEffect(() => {
        if (targetPost?.post && targetPost.post.isReel) {
            if (targetPost.action === "create") {
                setPosts((prev) => [targetPost.post, ...prev]);
            } else if (targetPost.action === "update") {
                setPosts((prev) =>
                    prev.map((item) =>
                        item._id === targetPost.post._id
                            ? targetPost.post
                            : item
                    )
                );
            } else {
                setPosts((prev) =>
                    prev.filter((item) => item._id !== targetPost.post._id)
                );
            }
        }
        mutate(reelKey);
        return () => {
            resetTargetPost();
        };
    }, [targetPost, resetTargetPost, reelKey]);
    useEffect(() => {
        setIsPC(mediaQuery);
    }, [mediaQuery]);
    if (data?.result?.length === 0) {
        return (
            <div className="text-center mt-10">
                <Film className="size-10 mx-auto" />
                <p className="text-3xl font-extrabold mt-2">Không có video</p>
            </div>
        );
    }
    if (isLoading) {
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
            scrollThreshold={0.7}
            className="mt-5"
            hasMore={data?.total ? posts.length < data.total : false}
            loader={
                isLoading && (
                    <div className="grid grid-cols-3 gap-0.5">
                        {Array(4)
                            .fill(0)
                            .map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="w-full md:aspect-[3/4] aspect-square rounded-none"
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

export default UserListReel;
