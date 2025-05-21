import { IPost } from '@/types/types';

import SuggesstionPostList from './SuggesstionPostList';

type SuggesstionPostProps = {
    post: IPost;
};
const SuggesstionPost = ({ post }: SuggesstionPostProps) => {
    return (
        <>
            <h2 className="text-sm text-second-gray font-semibold">
                Thêm các bài viết từ{" "}
                <span className="text-primary-white">
                    {post?.createdBy?.name}
                </span>
            </h2>
            <SuggesstionPostList
                userId={post?.createdBy._id as string}
                post={post}
            ></SuggesstionPostList>
        </>
    );
};

export default SuggesstionPost;
