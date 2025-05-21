import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { Heart } from 'lucide-react';
import { useMemo } from 'react';

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
};
const ReplyItem = ({
    reply,
    replies,
    parentCmtList,
    listPosts,
    onSetPosts,
    onSetCmtList,
}: ReplyItemProps) => {
    const { settargetCmt } = useMyStore();
    const sanitizedHTML = useMemo(() => {
        return DOMPurify.sanitize(reply.content);
    }, [reply.content]);
    const contentParsed = parse(sanitizedHTML);
    return (
        <li className="flex justify-between gap-x-4 group">
            <div className="flex gap-x-2 flex-1">
                <MiniUserProfile user={reply.createdBy}></MiniUserProfile>
                <div className="flex-1">
                    <p className="text-sm font-semibold max-w-[300px] line-clamp-2 text-primary-white">
                        {reply.createdBy.name}{" "}
                        <span className="font-normal">{contentParsed}</span>
                    </p>
                    <div className="text-xs text-second-gray flex items-center gap-x-2 pt-2">
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
                        ></CommentActions>
                    </div>
                </div>
            </div>

            <Heart className="size-3 cursor-pointer mt-2 text-primary-white" />
        </li>
    );
};

export default ReplyItem;
