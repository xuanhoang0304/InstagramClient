"use client";
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Heart } from 'lucide-react';
import { useMemo, useState } from 'react';

import MiniUserProfile from '@/features/home/components/posts/miniUser/MiniUserProfile';
import { formatNumber, getRelativeTime } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { IComment, IPost } from '@/types/types';

import { CommentActions } from './CommentActions';
import ShowRepliesBtn from './ShowRepliesBtn';

type CommentItemProps = {
    cmt: IComment;
    list: IComment[];
    post: IPost | null;
    listPosts?: IPost[];
    onSetPosts?: (posts: IPost[] | []) => void;
    onSetCmtList: (list: IComment[] | []) => void;
};
const CommentItem = ({
    cmt,
    post,
    list,
    listPosts,
    onSetPosts,
    onSetCmtList,
}: CommentItemProps) => {
    const { settargetCmt } = useMyStore();
    const sanitizedHTML = useMemo(() => {
        return DOMPurify.sanitize(cmt.content);
    }, [cmt.content]);
    const contentParsed = parse(sanitizedHTML);
    const [showFullCmt, setShowFullCmt] = useState(false);
    const fullCmt =
        showFullCmt || contentParsed.toString().length < 100
            ? contentParsed
            : contentParsed.toString().slice(0, 100) + "...";
    const isOwner = cmt.createdBy._id === post?.createdBy._id;

    return (
        <li className="flex justify-between gap-x-4 group">
            <div className="flex flex-1 gap-x-2">
                <MiniUserProfile user={cmt.createdBy}></MiniUserProfile>
                <div className="flex-1">
                    <p className="text-sm font-semibold flex-wrap max-w-[300px] line-clamp-2 flex items-center gap-x-2 text-primary-white">
                        {cmt.createdBy.name}
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
                        <p>{getRelativeTime(String(cmt.createdAt))}</p>
                        {cmt.likes.length >= 0 && (
                            <p className="font-semibold">
                                {formatNumber(cmt.likes.length)} lượt thích
                            </p>
                        )}
                        <button
                            onClick={() => {
                                settargetCmt(cmt);
                            }}
                            className="font-semibold"
                        >
                            trả lời
                        </button>
                        <CommentActions
                            cmt={cmt}
                            parentCmtList={list}
                            isParent
                            listPosts={listPosts}
                            onSetPosts={onSetPosts}
                            onSetCmtList={onSetCmtList}
                        ></CommentActions>
                    </div>
                    {cmt.replies && (
                        <ShowRepliesBtn
                            parentCmt={cmt}
                            post={post}
                            parentCmtList={list}
                            listPosts={listPosts}
                            onSetPosts={onSetPosts}
                            onSetCmtList={onSetCmtList}
                        ></ShowRepliesBtn>
                    )}
                </div>
            </div>

            <Heart
                onClick={() => {
                    alert(cmt._id);
                }}
                className="mt-2 cursor-pointer size-3 text-primary-white"
            />
        </li>
    );
};

export default CommentItem;
