"use client";
import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Heart } from 'lucide-react';
import { useMemo } from 'react';

import MiniUserProfile from '@/features/home/components/posts/miniUser/MiniUserProfile';
import { PostProp } from '@/features/home/components/posts/type';
import { formatNumber, getRelativeTime } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { IComment, IPost } from '@/types/types';

import { CommentActions } from './CommentActions';
import ShowRepliesBtn from './ShowRepliesBtn';

type CommentItemProps = {
    cmt: IComment;
    list: IComment[];
    listPosts?: IPost[];
    onSetPosts?: (posts: IPost[] | []) => void;
    onSetCmtList: (list: IComment[] | []) => void;
} & PostProp;
const CommentItem = ({
    cmt,
    item,
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

    return (
        <li className="flex justify-between gap-x-4 group">
            <div className="flex gap-x-2 flex-1">
                <MiniUserProfile user={cmt.createdBy}></MiniUserProfile>
                <div className="flex-1">
                    <p className="text-sm font-semibold max-w-[300px] line-clamp-2 text-primary-white">
                        {cmt.createdBy.name}{" "}
                        <span className="font-normal">{contentParsed}</span>
                    </p>
                    <div className="text-xs text-second-gray flex items-center gap-x-2 pt-2">
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
                            post={item}
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
                className="size-3 cursor-pointer mt-2 text-primary-white"
            />
        </li>
    );
};

export default CommentItem;
