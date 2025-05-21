import { IComment, IPost } from '@/types/types';

import ReplyItem from './ReplyItem';

type ReplyListProps = {
    repliesCmt: IComment[];
    parentCmtList: IComment[];
    post: IPost | null;
    listPosts?: IPost[];
    onSetPosts?: (post: IPost[]) => void;
    onSetCmtList: (list: IComment[] | []) => void;
};
const ReplyList = ({
    repliesCmt,
    post,
    parentCmtList,
    listPosts,
    onSetPosts,
    onSetCmtList,
}: ReplyListProps) => {
    return (
        <ul className="flex flex-col gap-y-4 mt-4">
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
                    ></ReplyItem>
                ))}
        </ul>
    );
};

export default ReplyList;
