import PostButtons from '@/features/home/components/posts/PostButtons';
import PostCaption from '@/features/home/components/posts/PostCaption';
import PostItemHeading from '@/features/home/components/posts/PostItemHeading';
import PostItemMedia from '@/features/home/components/posts/PostItemMedia';
import PostModal from '@/features/home/components/posts/postModal/PostModal';
import PostModalContent from '@/features/home/components/posts/postModal/PostModalContent';
import { PostProp } from '@/features/home/components/posts/type';
import { IPost } from '@/types/types';

import { CommentInput } from '../comments/CommentInput';

type PostItemsProps = {
    onSetPosts: (post: IPost[] | []) => void;
    listPosts: IPost[];
} & PostProp;
const PostItems = ({ item, onSetPosts, listPosts }: PostItemsProps) => {
    return (
        <li id={`${item?._id}`}>
            {/* heading */}
            <PostItemHeading
                isShowTime
                item={item}
                modal={false}
            ></PostItemHeading>
            {/* Media */}
            <PostItemMedia item={item} className="mt-3"></PostItemMedia>
            {/*Post Buttons */}
            <PostButtons
                item={item}
                modal={false}
                listPosts={listPosts}
                onSetPosts={onSetPosts}
            ></PostButtons>
            {item?.likes.length ? (
                <p className="text-sm font-semibold">
                    {parseInt(item.likes.length.toString())
                        .toLocaleString("vi-VN")
                        .replace(/,/g, ".")}{" "}
                    lượt thích
                </p>
            ) : null}
            {/* Caption */}
            <PostCaption item={item}></PostCaption>
            {/* Comments */}
            {item?.comments.length ? (
                <PostModal
                    post={item}
                    Trigger={
                        <p className="text-sm text-second-gray">
                            Xem tất cả {item.comments.length} bình luận
                        </p>
                    }
                    Content={
                        <PostModalContent
                            item={item}
                            listPosts={listPosts}
                            onSetPosts={onSetPosts}
                        ></PostModalContent>
                    }
                    className="px-0"
                ></PostModal>
            ) : null}
            {/* Cmt Input */}
            <CommentInput
                modal={false}
                post={item}
                listPosts={listPosts}
                onSetPosts={onSetPosts}
            ></CommentInput>
        </li>
    );
};

export default PostItems;
