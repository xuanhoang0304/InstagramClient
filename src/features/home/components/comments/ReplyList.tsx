import { IComment, IPost } from '@/types/types';

import ReplyItem from './ReplyItem';

type ReplyListProps = {
    repliesCmt: IComment[];
    parentCmtList: IComment[];
    post: IPost | null;
    listPosts?: IPost[];
    onSetPosts?: (post: IPost[]) => void;
    onSetCmtList: (list: IComment[] | []) => void;
    onSetRepliesPage: (page: number) => void;
};
const ReplyList = ({
    repliesCmt,
    post,
    parentCmtList,
    listPosts,
    onSetPosts,
    onSetCmtList,
    onSetRepliesPage,
}: ReplyListProps) => {
    // if(!repliesCmt.length) return null;
    return (
        <ul className="flex flex-col mt-4 gap-y-4">
            {repliesCmt &&
                repliesCmt.map((reply) => (
                    <ReplyItem
                        key={reply._id}
                        reply={reply}
                        post={post}
                        parentCmtList={parentCmtList}
                        replies={repliesCmt}
                        listPosts={listPosts}
                        onSetPosts={onSetPosts}
                        onSetCmtList={onSetCmtList}
                        onSetRepliesPage={onSetRepliesPage}
                    ></ReplyItem>
                ))}
        </ul>
    );
};

export default ReplyList;
