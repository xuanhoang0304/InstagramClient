import { CirclePlus } from 'lucide-react';

import CommentItem from '@/features/home/components/comments/CommentItem';
import PostCaption from '@/features/home/components/posts/PostCaption';
import { cn, handleGetParentCmtByPostId } from '@/lib/utils';
import { IComment, IPost } from '@/types/types';

type CommentListProps = {
    post: IPost | null;
    parentList: IComment[];
    totalCmt: number;
    page: number;
    listPosts: IPost[] | undefined;
    onSetNextPage?: () => void;
    onSetPosts?: (posts: IPost[] | []) => void;
    onSetCmtList: (list: IComment[] | []) => void;
};

const CommentList = ({
    post,
    parentList,
    totalCmt,
    page,
    listPosts,
    onSetPosts,
    onSetNextPage,
    onSetCmtList,
}: CommentListProps) => {
    const handleLoadMore = async () => {
        if (parentList.length >= totalCmt) {
            return;
        }
        const res = await handleGetParentCmtByPostId(
            post?._id as string,
            page + 1
        );
        if (res?.comments) {
            const newList = [...parentList, ...res?.comments];
            onSetCmtList?.(newList);
        }
        onSetNextPage?.();
    };
    if (parentList.length > 0)
        return (
            <ul className={cn("px-4 pt-4 pb-10  flex flex-col gap-y-3  ")}>
                <PostCaption showAvt item={post}></PostCaption>

                {parentList.map((cmt) => (
                    <CommentItem
                        key={cmt._id}
                        item={post}
                        cmt={cmt}
                        list={parentList}
                        listPosts={listPosts}
                        onSetPosts={onSetPosts}
                        onSetCmtList={onSetCmtList}
                    ></CommentItem>
                ))}

                {/* Load more */}
                {parentList.length > 0 && parentList.length < totalCmt && (
                    <button
                        className="w-full mt-2 flex items-center justify-center py-1 "
                        onClick={handleLoadMore}
                    >
                        <CirclePlus />
                    </button>
                )}
            </ul>
        );
    return (
        <div className="border-y border-primary-gray p-4 h-full">
            <PostCaption showAvt item={post}></PostCaption>
            <div className=" flex flex-col h-[90%] items-center gap-y-2 justify-center">
                <p className="text-2xl font-bold">Chưa có bình luận nào</p>
                <p className="text-sm ">Bắt đầu trò chuyện</p>
            </div>
        </div>
    );
};

export default CommentList;
