import _ from 'lodash';
import { useEffect, useState } from 'react';

import { handleGetRepliesByParentCmtId } from '@/lib/utils';
import { useRepliesStore } from '@/store/repliesStore';
import { useMyStore } from '@/store/zustand';
import { IComment, IPost } from '@/types/types';

import ReplyList from './ReplyList';

type ShowRepliesBtnProp = {
    parentCmt: IComment;
    post: IPost | null;
    parentCmtList: IComment[];
    listPosts?: IPost[];
    onSetPosts?: (post: IPost[]) => void;
    onSetCmtList: (list: IComment[] | []) => void;
};
const ShowRepliesBtn = ({
    parentCmt,
    post,
    parentCmtList,
    listPosts,
    onSetPosts,
    onSetCmtList,
}: ShowRepliesBtnProp) => {
    // const [showReplies, setShowReplies] = useState(false);
    const [nextPage, setNextPage] = useState(1);
    const { repliesMap, setReplies, isShowReplies, setIsShowReplies } =
        useRepliesStore();
    const { newCmt, setNewCmt } = useMyStore();
    const handleGetReplies = async (parentCmtId: string, page: number) => {
        const data = await handleGetRepliesByParentCmtId(parentCmtId, page);

        if (data) {
            if (!Object.entries(repliesMap).length) {
                setReplies(parentCmt._id, data.replies);
                return;
            }
            const newReplies = _.uniqBy(
                [...repliesMap[parentCmt._id], ...data.replies],
                "_id"
            );
            if (newCmt?._id) {
                const newList = newReplies.filter(
                    (reply) => reply._id !== newCmt._id
                );
                setReplies(parentCmt._id, [...newList, newCmt]);
                return;
            }
            setReplies(parentCmt._id, newReplies);
        }
    };
    const handleBtnShowListClick = async () => {
        await handleGetReplies(parentCmt._id, nextPage);

        if (
            repliesMap[parentCmt._id].length === parentCmt.replies.length ||
            repliesMap[parentCmt._id]?.length > parentCmt.replies.length
        ) {
            setNextPage(1);
            setIsShowReplies(false);
            setReplies(parentCmt._id, []);
            setNewCmt(null);
            return;
        }

        setIsShowReplies(true);
        setNextPage((prev) => prev + 1);
    };
    const handleSetRepleisPage = (page: number) => {
        setNextPage(page);
    };
    useEffect(() => {
        setReplies(parentCmt._id, []);
    }, []);
    return (
        <>
            {parentCmt.replies.length != 0 &&
                !!Object.entries(repliesMap).length && (
                    <button
                        onClick={handleBtnShowListClick}
                        className="flex items-center mt-1 gap-x-2"
                    >
                        <div className="h-0.25 w-5 bg-second-gray rounded-full"></div>
                        <p className="text-xs text-second-gray">
                            {repliesMap[parentCmt._id]?.length >=
                            parentCmt.replies.length
                                ? "Ẩn các câu trả lời"
                                : `Xem thêm ${
                                      parentCmt.replies.length -
                                      repliesMap[parentCmt._id]?.length
                                  } câu trả lời`}
                        </p>
                    </button>
                )}
            {isShowReplies && Object.entries(repliesMap).length && (
                <ReplyList
                    repliesCmt={repliesMap[parentCmt._id]}
                    post={post}
                    parentCmtList={parentCmtList}
                    listPosts={listPosts}
                    onSetPosts={onSetPosts}
                    onSetCmtList={onSetCmtList}
                    onSetRepliesPage={handleSetRepleisPage}
                ></ReplyList>
            )}
        </>
    );
};

export default ShowRepliesBtn;
