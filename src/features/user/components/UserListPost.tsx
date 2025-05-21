"use client";
import _, { debounce } from 'lodash';
import { Grid3x3 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mutate } from 'swr';

import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { usePostStore } from '@/store/postStore';
import { getPostsByCreated, IPost } from '@/types/types';

import UserPostItem from './UserPostItem';

const UserListPost = () => {
    const { targetPost, resetTargetPost } = usePostStore();
    const [posts, setPosts] = useState<IPost[] | []>([]);
    const [page, setPage] = useState(1);
    const { userId } = useParams();
    const scrollPositionRef = useRef<number>(0);
    const postKey = `${envConfig.BACKEND_URL}/posts/?filters={"createdBy": ["${userId}"],"isReel":"false"}&limit=3&page=${page}&sorts={ "pinned": -1, "createdAt":-1}`;
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
        setPosts((prev) => handler(prev, post));
        mutate(postKey);
    }, [targetPost, postKey]);

    useEffect(() => {
        if (data?.result?.length) {
            setPosts((prev) => _.uniqBy([...prev, ...data.result], "_id"));
            window.scrollTo(0, scrollPositionRef.current);
        }
    }, [data]);
    useEffect(() => {
        handleTargetPost();
        return () => resetTargetPost();
    }, [handleTargetPost, resetTargetPost]);
    if (!data?.result?.length && page === 1) {
        return (
            <div className="text-center mt-10">
                <Grid3x3 className="size-10 mx-auto" />
                <p className="text-3xl font-extrabold mt-2">
                    Không có bài viết
                </p>
            </div>
        );
    }

    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchData}
            className="mt-5"
            hasMore={data?.total ? posts.length < data.total : false}
            loader={
                isLoading && (
                    <div className="grid grid-cols-3 gap-1">
                        {Array(3)
                            .fill(0)
                            .map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="w-full h-[410px] mt-1 rounded-none"
                                />
                            ))}
                    </div>
                )
            }
        >
            <ul className="grid grid-cols-3 gap-1">
                {posts.map((item) => (
                    <UserPostItem post={item} key={item._id} />
                ))}
            </ul>
        </InfiniteScroll>
    );
};

export default UserListPost;
