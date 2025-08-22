"use client";
import { ArrowLeft, ChevronDown, MessageCirclePlus } from 'lucide-react';

import { Skeleton } from '@/components/ui/skeleton';
import { useMyStore } from '@/store/zustand';

import AddGroupsChatBtn from './AddGroupsChatBtn';

const ChatBoxsHeading = () => {
    const { myUser } = useMyStore();
    return (
        <div className="flex justify-between items-center px-6">
            <div className="flex items-center gap-2">
                {myUser?.name ? (
                    <>
                        <button
                            onClick={() => {
                                window.history.back();
                            }}
                            className="px-2 py-1 flex lg:hidden items-center  justify-center"
                        >
                            <ArrowLeft />
                        </button>
                        <h2 className="font-bold text-xl">{myUser?.name}</h2>
                        <ChevronDown className="size-5" />
                    </>
                ) : (
                    <Skeleton className="h-7 w-[200px]"></Skeleton>
                )}
            </div>
            {/* <MessageCirclePlus /> */}
            {myUser?.name ? (
                <AddGroupsChatBtn
                    trigger={<MessageCirclePlus></MessageCirclePlus>}
                ></AddGroupsChatBtn>
            ) : (
                <Skeleton className="size-6"></Skeleton>
            )}
        </div>
    );
};

export default ChatBoxsHeading;
