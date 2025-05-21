"use client";
import { useEffect, useState } from 'react';

import Loading from '@/app/loading';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { IPost } from '@/types/types';

import PostModalContent from '../home/components/posts/postModal/PostModalContent';
import SuggesstionPost from './SuggesstionPost';

const PostPage = ({ postId }: { postId: string }) => {
    const [post, setPost] = useState<IPost | null>(null);
    const { data, isLoading } = useApi<IPost>(
        `${envConfig.BACKEND_URL}/posts/${postId}`
    );
    
    const handleSetPostPage = (post: IPost) => {
        setPost(post);
    };
    useEffect(() => {
        if (data) {
            setPost(data);
        }
    }, [data]);

    if (isLoading) return <Loading></Loading>;
    if (!post) {
        return <p>Bài viết không tồn tại hoặc đã bị xóa</p>;
    }
    return (
        <div className="mx-auto mt-10 max-w-[935px]">
            <div className="flex max-h-[588px] shadow-[0_0_23px_0_rgba(255,255,255,0.2)] rounded-lg">
                <PostModalContent
                    item={post}
                    onSetNewPost={handleSetPostPage}
                ></PostModalContent>
            </div>
            <div className="my-10 bg-primary-gray h-0.5 w-full"></div>
            <SuggesstionPost post={post}></SuggesstionPost>
        </div>
    );
};

export default PostPage;
