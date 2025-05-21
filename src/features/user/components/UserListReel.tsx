"use client";
import _, { debounce } from 'lodash';
import { Film } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { mutate } from 'swr';

import Loading from '@/app/loading';
import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { usePostStore } from '@/store/postStore';
import { getPostsByCreated, IPost } from '@/types/types';

import UserPostItem from './UserPostItem';

const UserListReel = () => {
    const { targetPost, resetTargetPost } = usePostStore();
    const [posts, setPosts] = useState<IPost[] | []>([]);
    const [page, setPage] = useState(1);
    const { userId } = useParams();
    const scrollPositionRef = useRef<number>(0);
    const reelKey = `${envConfig.BACKEND_URL}/posts/?filters={"createdBy": ["${userId}"],"isReel":"true"}&limit=3&page=${page}&sorts={ "pinned": -1, "createdAt":-1}`;
    const { data, isLoading } = useApi<getPostsByCreated>(reelKey);

    const fetchData = debounce(() => {
        scrollPositionRef.current = window.scrollY;
        setPage((prev) => prev + 1);
    }, 500);

    useEffect(() => {
        if (data?.result?.length) {
            setPosts((prev) => _.uniqBy([...prev, ...data.result], "_id"));
            window.scrollTo(0, scrollPositionRef.current);
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
    if (isLoading && page === 1) {
        return <Loading />;
    }

    if (!data?.result?.length && page === 1) {
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
            scrollThreshold={0.7}
            className="mt-5"
            hasMore={data?.total ? posts.length < data.total : false}
            loader={
                isLoading && (
                    <div className="grid grid-cols-3 gap-1">
                        {Array(4)
                            .fill(0)
                            .map((_, index) => (
                                <Skeleton
                                    key={index}
                                    className="w-full h-[342px] rounded-none"
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

export default UserListReel;
