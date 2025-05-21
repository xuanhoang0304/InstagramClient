import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';

import PostModal from '@/features/home/components/posts/postModal/PostModal';
import { PostProp } from '@/features/home/components/posts/type';
import { cn, handleLikePost, handleSavePost } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { IPost } from '@/types/types';

import PostModalContent from './postModal/PostModalContent';

type PostButtonsProps = {
    listPosts?: IPost[];
    modal: boolean;
    onSetPosts?: (post: IPost[] | []) => void;
    onSetNewPost? : (post: IPost) => void;
} & PostProp;
const PostButtons = ({
    item,
    modal,
    listPosts,
    onSetPosts,
    onSetNewPost,
}: PostButtonsProps) => {
    const { myUser } = useMyStore();
    const curUId = myUser?._id;
    const handleLikeorUnlikePost = async (post: IPost) => {
        const res = await handleLikePost(post);
        if (res?.code === 200) {
            if (listPosts && listPosts.length) {
                const newPost = listPosts?.map((post) =>
                    post._id === res.data._id ? res.data : post
                );
                onSetPosts?.(newPost as IPost[]);
                return;
            }
            onSetNewPost?.(res.data);
        }
    };
    const handleSaveorUnSavePost = async (post: IPost) => {
        const res = await handleSavePost(post);
        if (res?.code === 200) {
            if (listPosts && listPosts.length) {
                const newPost = listPosts?.map((post) =>
                    post._id === res.data._id ? res.data : post
                );
                onSetPosts?.(newPost as IPost[]);
                return;
            }
            onSetNewPost?.(res.data);
        }
    };
    return (
        <div className="my-1 flex items-center justify-between">
            <div className="flex items-center">
                <button
                    onClick={() => handleLikeorUnlikePost(item as IPost)}
                    className="p-2 flex items-center justify-center hover:opacity-40 "
                >
                    <Heart
                        className={cn(
                            item?.likes.includes(String(curUId)) &&
                                "fill-red-500 text-red-500"
                        )}
                    />
                </button>
                {!modal && (
                    <PostModal
                        Trigger={<MessageCircle className="-rotate-90" />}
                        Content={
                            <PostModalContent
                                item={item}
                                listPosts={listPosts}
                                onSetPosts={onSetPosts}
                            ></PostModalContent>
                        }
                        post={item}
                    ></PostModal>
                )}
                <button className="p-2 flex items-center justify-center hover:opacity-40 ">
                    <Send />
                </button>
            </div>
            <button
                onClick={() => handleSaveorUnSavePost(item as IPost)}
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
