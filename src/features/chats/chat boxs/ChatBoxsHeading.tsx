"use client";
import { ChevronDown, MessageCirclePlus } from 'lucide-react';

import { useMyStore } from '@/store/zustand';

import AddGroupsChatBtn from './AddGroupsChatBtn';

const ChatBoxsHeading = () => {
    const { myUser } = useMyStore();
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <h2 className="font-bold text-xl">{myUser?.name}</h2>
                <ChevronDown className="size-5" />
            </div>
            {/* <MessageCirclePlus /> */}
            <AddGroupsChatBtn></AddGroupsChatBtn>
        </div>
    );
};

export default ChatBoxsHeading;
