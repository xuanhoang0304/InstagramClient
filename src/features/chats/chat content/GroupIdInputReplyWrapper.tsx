import { X } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { useMessageStore } from '../MessageStore';

const GroupIdInputReplyWrapper = () => {
    const { targetMessage, setTargetMessage } = useMessageStore();
    return (
        <div className=" p-2 flex justify-between items-start">
            <div>
                <p className="text-sm">
                    Đang trả lời
                    <span className="ml-1 font-semibold">
                        {targetMessage?.sender.name}
                    </span>
                </p>
                <p className="text-xs text-second-gray mt-1 max-w-[50%] line-clamp-2 ">
                    {targetMessage?.text}
                </p>
                {(!!targetMessage?.images.length ||
                    !!targetMessage?.videos.length) && (
                    <p className="text-xs text-second-gray mt-1">
                        File ảnh hoặc video đính kèm
                    </p>
                )}
            </div>

            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={() => setTargetMessage(null)}>
                        <X></X>
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Hủy bỏ trả lời tin nhắn</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
};

export default GroupIdInputReplyWrapper;
