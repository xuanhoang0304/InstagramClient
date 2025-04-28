import PostModal from "@/features/home/components/posts/PostModal";
import PostModalContent from "@/features/home/components/posts/PostModalContent";
import { PostProp } from "@/features/home/components/posts/type";
import { cn, handleLikePost, handleSavePost } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IPost } from "@/types/types";
import { Bookmark, Heart, MessageCircle, Send } from "lucide-react";
type PostButtonsProps = {
    onSetPosts: (post: IPost) => void;
} & PostProp
const PostButtons = ({item,onSetPosts}:PostButtonsProps) => {
    const { myUser } = useMyStore();
    const curUId = myUser?._id;
    const handleLikeorUnlikePost = async (post: IPost) => {
        const data = await handleLikePost(post);
        if (data?.code === 200) {
            onSetPosts?.(data.data);
        }
    };
    const handleSaveorUnSavePost = async (post: IPost) => {
        const data = await handleSavePost(post);
        if (data?.code === 200) {
            onSetPosts?.(data.data);
        }
    };
    return (
        <div className="my-1 flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={() => handleLikeorUnlikePost(item)}
                    className="p-2 flex items-center justify-center hover:opacity-40 "
                >
                    <Heart
                        className={cn(
                            item.likes.includes(String(curUId)) &&
                                "fill-red-500 text-red-500"
                        )}
                    />
                </button>
                <PostModal
                    Trigger={<MessageCircle className="-rotate-90" />}
                    Content={
                        <PostModalContent
                            item={item}
                            onSetPosts={onSetPosts}
                        ></PostModalContent>
                    }
                ></PostModal>
                <button className="p-2 flex items-center justify-center hover:opacity-40 ">
                    <Send />
                </button>
            </div>
            <button
                onClick={() => handleSaveorUnSavePost(item)}
                className="p-2 flex items-center justify-center hover:opacity-40 "
            >
                <Bookmark
                    className={cn(
                        item?.savedBy.includes(String(curUId)) &&
                            "text-yellow-500 fill-yellow-500"
                    )}
                />
            </button>
        </div>
    );
};

export default PostButtons;
