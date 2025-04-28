import { apiClient } from "@/configs/axios";
import CommentItem from "@/features/home/components/comments/CommentItem";
import PostCaption from "@/features/home/components/posts/PostCaption";
import { PostProp } from "@/features/home/components/posts/type";
import { HttpResponse, IComment, IPost } from "@/types/types";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
type CommentListProps = {
    onSetPosts: (post: IPost) => void;
} & PostProp;
type getPostById = {
    result: {
        comments: IComment[];
        totalComments: number;
    };
} & HttpResponse;
const CommentList = ({ item, onSetPosts }: CommentListProps) => {
    const [commentList, setCommentList] = useState<IComment[]>([]);
    const [nextPage, setNextPage] = useState(1);
    const [totalCmt, setTotalCmt] = useState(0);
    const handleGetCommentsByPostId = async (postId: string) => {
        try {
            const data: getPostById = await apiClient.fetchApi(
                `http://localhost:5000/api/posts/${postId}/comments?page=${nextPage}&limit=4`
            );
            if (data.code === 200) {
                if (commentList.length === data.result.totalComments) return;
                const comments = data.result.comments;
                if (!commentList.length) {
                    setCommentList(comments);
                    setTotalCmt(data.result.totalComments);
                    return;
                }
                setCommentList((prev) => [...prev, ...comments]);
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    // const handleSetCommentist = (cmts: IComment[]) => {
    //     setCommentList(cmts);
    // };
    useEffect(() => {
        handleGetCommentsByPostId(item._id);
    }, [item._id, nextPage]);
    if (commentList.length > 0)
        return (
            <ul className="px-4 pt-4 pb-10 bg-black z-[10] relative h-[420px] flex flex-col gap-y-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <PostCaption
                    showAvt
                    item={item}
                    onSetPosts={onSetPosts}
                ></PostCaption>
                {commentList.map((cmt) => (
                    <CommentItem
                        key={cmt._id}
                        item={item}
                        cmt={cmt}
                        onSetPosts={onSetPosts}
                    ></CommentItem>
                ))}

                {/* Load more */}
                {commentList.length > 0 && commentList.length < totalCmt && (
                    <button
                        className="w-full mt-2 flex items-center justify-center py-1 "
                        onClick={() => {
                            if (commentList.length < totalCmt) {
                                setNextPage((prev) => prev + 1);
                            }
                        }}
                    >
                        <CirclePlus />
                    </button>
                )}
            </ul>
        );
    return (
        <div className="border-y border-primary-gray p-4 h-[420px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <PostCaption
                showAvt
                item={item}
                onSetPosts={onSetPosts}
            ></PostCaption>
            <div className=" flex flex-col h-[90%] items-center gap-y-2 justify-center">
                <p className="text-2xl font-bold">Chưa có bình luận nào</p>
                <p className="text-sm ">Bắt đầu trò chuyện</p>
            </div>
        </div>
    );
};

export default CommentList;
