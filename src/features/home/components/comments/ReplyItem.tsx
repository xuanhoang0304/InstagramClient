import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';

import { formatNumber, getRelativeTime } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { IComment, IPost } from '@/types/types';

import MiniUserProfile from '../posts/miniUser/MiniUserProfile';
import { CommentActions } from './CommentActions';

type ReplyItemProps = {
    reply: IComment;
    post: IPost | null;
    replies: IComment[];
    parentCmtList: IComment[];
    listPosts?: IPost[];
    onSetPosts?: (post: IPost[]) => void;
    onSetCmtList: (list: IComment[] | []) => void;
    onSetRepliesPage: (page: number) => void;
};
const ReplyItem = ({
    reply,
    replies,
    parentCmtList,
    post,
    listPosts,
    onSetPosts,
    onSetCmtList,
    onSetRepliesPage
}: ReplyItemProps) => {
    const { settargetCmt } = useMyStore();
    const sanitizedHTML = useMemo(() => {
        return DOMPurify.sanitize(reply.content);
    }, [reply.content]);
    const contentParsed = parse(sanitizedHTML);
    const [showFullCmt, setShowFullCmt] = useState(false);
    const fullCmt =
        showFullCmt || contentParsed.toString().length < 100
            ? contentParsed
            : contentParsed.toString().slice(0, 100) + "...";
    const isOwner = reply.createdBy._id === post?.createdBy._id;
    return (
        <li className="flex justify-between gap-x-4 group">
            <div className="flex flex-1 gap-x-2">
                <MiniUserProfile user={reply.createdBy}></MiniUserProfile>
                <div className="flex-1">
                <p className="text-sm font-semibold flex-wrap max-w-[300px] line-clamp-2 flex items-center gap-x-2 text-primary-white">
                        {reply.createdBy.name}
                        {isOwner && (
                            <span className="italic font-semibold text-second-blue">
                                tác giả
                            </span>
                        )}
                        :
                        <span className="font-normal">
                            {fullCmt}
                            {contentParsed.toString().length > 100 && (
                                <button
                                    onClick={() => setShowFullCmt(!showFullCmt)}
                                    className='text-xs text-second-gray ml-1'
                                >
                                    {showFullCmt ? "ẩn bớt" : "xem thêm"}
                                </button>
                            )}
                        </span>
                    </p>
                    <div className="flex items-center pt-2 text-xs text-second-gray gap-x-2">
                        <p>{getRelativeTime(String(reply.createdAt))}</p>
                        {reply.likes.length >= 0 && (
                            <p className="font-semibold">
                                {formatNumber(reply.likes.length)} lượt thích
                            </p>
                        )}
                        <button
                            onClick={() => {
                                settargetCmt(reply);
                            }}
                            className="font-semibold"
                        >
                            trả lời
                        </button>
                        <CommentActions
                            cmt={reply}
                            isParent={false}
                            repliesList={replies}
                            parentCmtList={parentCmtList}
                            onSetCmtList={onSetCmtList}
                            listPosts={listPosts}
                            onSetPosts={onSetPosts}
                            onSetRepliesPage={onSetRepliesPage}
                        ></CommentActions>
                    </div>
                </div>
            </div>

            <Heart className="mt-2 cursor-pointer size-3 text-primary-white" />
        </li>
    );
};

export default ReplyItem;
