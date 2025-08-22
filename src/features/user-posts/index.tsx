"use client";
import _ from 'lodash';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { Skeleton } from '@/components/ui/skeleton';
import { useApi } from '@/hooks/useApi';
import { tempArr } from '@/lib/utils';
import { getPostsByCreated, IPost } from '@/types/types';

import PostItems from '../home/components/posts/PostItems';

const UserPostsPage = () => {
    const router = useRouter();
    const { userId } = useParams();
    const postId = useSearchParams().get("postId");
    const isMobile = useMediaQuery("(max-width: 767px)");
    const [page, setPage] = useState(1);
    const postRef = useRef<HTMLLIElement>(null);
    const { data, isLoading } = useApi<getPostsByCreated>(
        userId
            ? `/api/posts/?filters={"createdBy": ["${userId}"]}&sorts={ "pinned": -1, "createdAt":-1}&page=${page}&limit=6`
            : null
    );
    const [listPosts, setListPosts] = useState<IPost[]>([]);
    const handleSetPosts = (post: IPost[] | []) => {
        setListPosts(post);
    };

    useEffect(() => {
        if (data) {
            setListPosts((prev) => _.unionBy([...prev, ...data.result], "_id"));
        }
    }, [data]);
    useEffect(() => {
        if (postId && listPosts.length) {
            const postExists = listPosts.some((post) => post._id === postId);
            if (postExists && postRef.current) {
                postRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            } else {
                setPage((prev) => prev + 1);
            }
        }
    }, [listPosts]);
    useEffect(() => {
        if (!isMobile) {
            router.push(`/post/${postId}`);
        }
    },[isMobile])
    if (isLoading) {
        return (
            <ul className="flex flex-col gap-y-5 max-w-[468px] mx-auto mt-5 lg:mt-11">
                {tempArr.map((item) => (
                    <li key={item.id}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <Skeleton className="size-8 rounded-full cursor-pointer"></Skeleton>
                                <Skeleton className="w-[130px] h-3"></Skeleton>
                            </div>
                            <Skeleton className="size-6"></Skeleton>
                        </div>
                        <Skeleton className="w-full md:w-[468px] md:h-[585px] h-[300px] rounded-[4px] mt-3"></Skeleton>
                        <Skeleton className="w-full h-[118px] mt-1 rounded-[2px] mt-tega1"></Skeleton>
                    </li>
                ))}
            </ul>
        );
    }
    return (
        <>
            <div className="fixed top-0 left-0 w-full bg-black flex gap-x-6 z-10 pr-3 py-4">
                <button
                    onClick={() => {
                        router.back();
                    }}
                    className="px-3 py-1 flex items-center justify-center"
                >
                    <ArrowLeft />
                </button>
                <h3 className="font-bold">Bài viết</h3>
            </div>
            <ul className="flex flex-col mt-[66px] gap-y-5 md:max-w-[468px] mx-auto lg:mt-6">
                {listPosts.map((item) => (
                    <PostItems
                        key={item._id}
                        item={item}
                        listPosts={listPosts}
                        onSetPosts={handleSetPosts}
                        PostRef={postId === item._id ? postRef : undefined}
                    />
                ))}
            </ul>
        </>
    );
};

export default UserPostsPage;
