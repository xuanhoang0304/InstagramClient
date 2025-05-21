import _ from 'lodash';
import { useEffect, useState } from 'react';

import envConfig from '@/configs/envConfig';
import CommentList from '@/features/home/components/comments/CommentList';
import PostItemHeading from '@/features/home/components/posts/PostItemHeading';
import PostItemMedia from '@/features/home/components/posts/PostItemMedia';
import { useApi } from '@/hooks/useApi';
import { HttpResponse, IComment, IPost } from '@/types/types';

import { CommentInput } from '../../comments/CommentInput';
import PostButtons from '../PostButtons';

type PostModalContentProps = {
    listPosts?: IPost[];
    item: IPost | null;
    onSetPosts?: (posts: IPost[] | []) => void;
    onSetNewPost?: (post: IPost) => void;
};
type getParentCmtByPostId = {
    result: {
        comments: IComment[];
        totalComments: number;
    };
} & HttpResponse;
const PostModalContent = ({
    item,
    listPosts,
    onSetPosts,
    onSetNewPost,
}: PostModalContentProps) => {
    const [commentList, setCommentList] = useState<IComment[] | []>([]);
    const [page, setPage] = useState(1);
    const [totalCmt, setTotalCmt] = useState(0);
    const { data, mutate } = useApi<getParentCmtByPostId>(
        `${envConfig.BACKEND_URL}/posts/${item?._id}/comments?page=${page}&limit=3`
    );
    const handleSetCommentist = (list: IComment[] | []) => {
        setCommentList(list);
        mutate();
    };
    const handleSetNextPage = () => {
        setPage((prev) => prev + 1);
    };

    useEffect(() => {
        if (data) {
            if (!commentList.length) {
                const comments = data.result.comments;
                setCommentList(comments);
                setTotalCmt(data.result.totalComments);
                return;
            }
            const arr = _.unionBy(
                [...commentList, ...data?.result.comments],
                "_id"
            );
            setCommentList(arr);
            setTotalCmt(data?.result.totalComments as number);
        }
    }, [data]);
    return (
        <>
            <PostItemMedia
                className="max-w-[468px] h-auto rounded-bl-lg rounded-tl-lg rounded-tr-none rounded-br-none"
                item={item}
                figureClassName="rounded-none h-full"
                imageClassName="rounded-none block h-full"
                videoClassName="m-0 border-none rounded-tl-lg rounded-bl-lg bg-black  "
            ></PostItemMedia>
            <div className=" w-[485px] h-auto bg-black rounded-tr-lg rounded-br-lg">
                <PostItemHeading
                    isShowTime={false}
                    item={item}
                    className="p-4"
                    modal
                ></PostItemHeading>

                <div className="bg-black h-[400px] border-t border-primary-gray overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    <CommentList
                        post={item}
                        parentList={commentList}
                        totalCmt={totalCmt}
                        page={page}
                        listPosts={listPosts}
                        onSetNextPage={handleSetNextPage}
                        onSetCmtList={handleSetCommentist}
                        onSetPosts={onSetPosts}
                    ></CommentList>
                </div>
                <div className="w-full p-2 border-t border-primary-gray">
                    <PostButtons
                        item={item}
                        modal
                        listPosts={listPosts}
                        onSetPosts={onSetPosts}
                        onSetNewPost={onSetNewPost}
                    ></PostButtons>
                    <CommentInput
                        post={item}
                        modal={true} // in post
                        cmtList={commentList}
                        listPosts={listPosts}
                        onSetPosts={onSetPosts}
                        onSetCmtList={handleSetCommentist}
                    ></CommentInput>
                </div>
            </div>
        </>
    );
};

export default PostModalContent;
