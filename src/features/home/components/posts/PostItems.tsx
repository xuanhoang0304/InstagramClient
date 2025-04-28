import { IPost } from "@/types/types";
import PostItemHeading from "@/features/home/components/posts/PostItemHeading";
import PostItemMedia from "@/features/home/components/posts/PostItemMedia";
import { PostProp } from "@/features/home/components/posts/type";
import PostButtons from "@/features/home/components/posts/PostButtons";
import PostModal from "@/features/home/components/posts/PostModal";
import PostModalContent from "@/features/home/components/posts/PostModalContent";
import PostCaption from "@/features/home/components/posts/PostCaption";

type PostItemsProps = {
    onSetPosts: (post: IPost) => void;
} & PostProp;
const PostItems = ({ item, onSetPosts }: PostItemsProps) => {
    return (
        <li id={`${item._id}`}>
            {/* heading */}
            <PostItemHeading
                isShowTime
                item={item}
                onSetPosts={onSetPosts}
            ></PostItemHeading>
            {/* Media */}
            <PostItemMedia item={item} className="mt-3"></PostItemMedia>
            {/*Post Buttons */}
            <PostButtons item={item} onSetPosts={onSetPosts}></PostButtons>
            {item.likes.length ? (
                <p className="text-sm font-semibold">
                    {parseInt(item.likes.length.toString())
                        .toLocaleString("vi-VN")
                        .replace(/,/g, ".")}{" "}
                    lượt thích
                </p>
            ) : null}
            {/* Caption */}
            <PostCaption item={item} onSetPosts={onSetPosts}></PostCaption>
            {/* Comments */}
            {item.comments.length ? (
                <PostModal
                    Trigger={
                        <p className="text-sm text-second-gray">
                            Xem tất cả {item.comments.length} bình luận
                        </p>
                    }
                    Content={
                        <PostModalContent
                            onSetPosts={onSetPosts}
                            item={item}
                        ></PostModalContent>
                    }
                    className="px-0"
                ></PostModal>
            ) : null}
        </li>
    );
};

export default PostItems;
