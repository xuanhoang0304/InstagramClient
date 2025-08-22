"use client";
import _, { debounce } from 'lodash';
import { Grid3x3 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mutate } from 'swr';
import { useMediaQuery } from 'usehooks-ts';

import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { usePostStore } from '@/store/postStore';
import { getPostsByCreated, IPost } from '@/types/types';

import UserPostItem from './UserPostItem';

const UserListPost = () => {
    const { targetPost, resetTargetPost } = usePostStore();
    const [isPC, setIsPC] = useState(false);
    const mediaQuery = useMediaQuery("(min-width: 1025px)");
    const [posts, setPosts] = useState<IPost[] | []>([]);
    const [page, setPage] = useState(1);
    const { userId } = useParams();
    const scrollPositionRef = useRef<number>(0);
    const limit = isPC ? 6 : 9;
    const postKey = `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${userId}"],"isReel":"false"}&limit=${limit}&page=${page}&sorts={ "pinned": -1, "createdAt":-1}`;
    const { data, isLoading } = useApi<getPostsByCreated>(postKey);

    const fetchData = debounce(() => {
        scrollPositionRef.current = window.scrollY;
        setPage((prev) => prev + 1);
    }, 500);

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
            if (
                action === "create" &&
                prev.some((item) => item._id === post._id)
            ) {
                return prev;
            }
            const newPosts = handler(prev, post);
            return _.uniqBy(newPosts, "_id");
        });
        mutate(postKey, true);
    }, [targetPost, postKey]);

    useEffect(() => {
        if (data?.result?.length) {
            setPosts((prev) => _.uniqBy([...prev, ...data.result], "_id"));
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
                <p className="text-3xl font-extrabold mt-2">
                    Không có bài viết
                </p>
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
            className="mt-5"
            hasMore={posts.length < Number(data?.total)}
            loader={
                isLoading && (
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
                    <UserPostItem post={item} key={item._id} imageWrapClass='md:aspect-[3/4]' />
                ))}
            </ul>
        </InfiniteScroll>
    );
};

export default UserListPost;
