"use client";
import { ArrowDown } from 'lucide-react';
import { UIEvent, useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

import { useMessageStore } from '../MessageStore';
import { IGroup, IMessageFE } from '../type';
import { handleGroupMessages } from '../utils';
import GroupMessageList from './GroupMessageList';
import MessageProfile from './MessageProfile';

type Props = {
    msgList: IMessageFE[];
    page: number;
    totalMessage: number;
    inputWrapperHeight: number;
    group: IGroup | undefined;
    onSetNextPage: (page: number) => void;
};

const GroupIdContent = ({
    msgList,
    page,
    totalMessage,
    group,
    inputWrapperHeight,
    onSetNextPage,
}: Props) => {
    const { isNewMessage, setIsNewMessage } = useMessageStore();
    const scrollableDivRef = useRef<HTMLDivElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const debounceScrollY = useDebounce(scrollY, 300);
    const fetchMoreMessage = async () => {
        onSetNextPage(page + 1);
    };

    const handleScroll = (e: UIEvent<HTMLDivElement>) => {
        setScrollY(e.currentTarget.scrollTop);
    };
    const handleScrollToTop = () => {
        if (scrollableDivRef.current) {
            scrollableDivRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
            });
        }
    };
    const list = handleGroupMessages(msgList);
    useEffect(() => {
        if (scrollableDivRef.current && isNewMessage) {
            scrollableDivRef.current.scrollTop = 0;
            setIsNewMessage(false);
        }
    }, [isNewMessage, msgList]);

    return (
        <div
            style={{ bottom: `${inputWrapperHeight}px` }}
            className="inset-0 overflow-y-auto absolute top-[77px] left-0"
        >
            <button
                onClick={handleScrollToTop}
                className={cn(
                    "absolute bottom-[30px]  hidden left-1/2  -translate-x-1/2 z-30 bg-primary-gray p-2 rounded-full",
                    debounceScrollY < -50 && "block"
                )}
            >
                <ArrowDown />
            </button>
            <div
                id="scrollableDiv"
                onScroll={(e) => handleScroll(e)}
                ref={scrollableDivRef}
                className={cn(
                    "h-full overflow-y-auto relative flex flex-col-reverse pt-6 pb-4 px-3",
                    !msgList.length && "flex-col"
                )}
            >
                <InfiniteScroll
                    dataLength={msgList.length}
                    initialScrollY={20}
                    next={fetchMoreMessage}
                    inverse={true}
                    hasMore={msgList.length < totalMessage}
                    loader={null}
                    scrollThreshold={0.5}
                    scrollableTarget="scrollableDiv"
                    className="flex flex-col-reverse gap-y-4 mt-4 "
                >
                    <GroupMessageList
                        groupList={list}
                        isGroup={group?.isGroup}
                    ></GroupMessageList>
                </InfiniteScroll>
                {(msgList.length >= totalMessage || totalMessage === 0) && (
                    <MessageProfile group={group}></MessageProfile>
                )}
            </div>
        </div>
    );
};

export default GroupIdContent;
