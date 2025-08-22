import { Grid3x3 } from 'lucide-react';

import Loading from '@/components/layout/loading';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { getPostsByCreated, IPost } from '@/types/types';

import UserPostItem from '../user/components/UserPostItem';

type SuggesstionPostListProps = {
    userId: string;
    post: IPost;
};
const SuggesstionPostList = ({ userId, post }: SuggesstionPostListProps) => {
    const { data, isLoading } = useApi<getPostsByCreated>(
        `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${userId}"],"excludes": ["${post._id}"]}&limit=6&page=1&sorts={ "pinned": -1, "createdAt":-1}`
    );
    if (isLoading) {
        return <Loading></Loading>;
    }

    if (!data?.result?.length)
        return (
            <div className="text-center mt-10">
                <Grid3x3 className="size-10 mx-auto" />
                <p className="text-3xl font-extrabold mt-2">
                    Không có bài viết khác
                </p>
            </div>
        );
    return (
        <ul className="grid grid-cols-3 gap-1 mt-3">
            {data?.result?.map((item) => (
                <UserPostItem
                    post={item}
                    key={item._id}
                    imageWrapClass="aspect-[2/3] h-full"
                    videoClass="aspect-[2/3] h-full"
                />
            ))}
        </ul>
    );
};

export default SuggesstionPostList;
