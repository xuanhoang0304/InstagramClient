import { MessageCirclePlus } from 'lucide-react';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';
import { HttpResponse, User } from '@/types/types';

import AddGroupInput from './AddGroupInput';
import GroupChatSuggestion from './GroupChatSuggestion';

type SuggestionUserResponse = {
    result: {
        users: User[];
        totalUser: number;
    };
} & HttpResponse;

const AddGroupsChatBtn = () => {
    const [open, setOpen] = useState(false);
    const [suggestionList, setSuggestionList] = useState<User[] | []>([]);
    const [searchTxt, setSearchTxt] = useState("");
    const debouncedSearchTxt = useDebounce(searchTxt, 500);
    const [page, setPage] = useState(1);
    const ref = useRef<HTMLDivElement>(null);
    const { data } = useApi<SuggestionUserResponse>(
        debouncedSearchTxt &&
            `${envConfig.BACKEND_URL}/users/?filters={"keyword": "${debouncedSearchTxt}"}&page=${page}&limit=3`
    );

    const handleClose = () => {
        setOpen(false);
        setSearchTxt("");
        setSuggestionList([]);
        setPage(1);
    };
    const handleSetSearchTxt = (txt: string) => {
        setSearchTxt(txt);
    };
    useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
    useEffect(() => {
        if (data?.code == 200 && !suggestionList.length) {
            console.log("here");
            setSuggestionList(data.result.users);
        }
        if (!searchTxt) {
            setSuggestionList([]);
        }
    }, [data]);
    return (
        <Dialog open={open}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger onClick={() => setOpen(true)}>
                        <MessageCirclePlus></MessageCirclePlus>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Tin nhắn mới</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DialogContent
                ref={ref}
                className="!bg-primary-gray border-none !px-0 !pt-2 pb-4 !block"
            >
                <DialogTitle className="text-center py-2">
                    Tin nhắn mới
                </DialogTitle>

                <AddGroupInput
                    searchTxt={searchTxt}
                    onSetSearchTxt={handleSetSearchTxt}
                ></AddGroupInput>

                <div className="h-[300px]">
                    {debouncedSearchTxt && (
                        <GroupChatSuggestion
                            list={suggestionList}
                        ></GroupChatSuggestion>
                    )}
                </div>
                <div className="px-4">
                    <Button
                        className={cn(
                            "bg-second-blue hover:bg-primary-blue w-full text-primary-white",
                            !suggestionList.length &&
                                "pointer-events-none opacity-30"
                        )}
                    >
                        Chat
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddGroupsChatBtn;
