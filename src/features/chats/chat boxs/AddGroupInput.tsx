import { X } from 'lucide-react';
import { ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { User } from '@/types/types';

type AddGroupInputProps = {
    searchTxt: string;
    selectedList: User[] | [];
    onSetSelectedList: (list: User[] | []) => void;
    onSetSearchTxt: (txt: string) => void;
};
const AddGroupInput = ({
    searchTxt,
    selectedList,
    onSetSelectedList,
    onSetSearchTxt,
}: AddGroupInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSetSearchTxt(e.target.value);
    };
    const handleDeleteSelectedItem = (userId: string) => {
        const newList = selectedList.filter((item) => item._id !== userId);
        onSetSelectedList(newList);
    };
    return (
        <div className={cn("border-y  flex items-center mt-3 flex-wrap px-2 py-1", !!selectedList.length && "py-2")}>
            <p className="pr-2 font-semibold">Tới:</p>
            <ul className="flex items-center gap-x-2">
                {selectedList.map((user) => (
                    <div
                        key={user._id}
                        className="bg-primary-blue-hover py-1 px-2 rounded-full flex items-center gap-x-1"
                    >
                        <h4 className="text-xs text-primary-blue font-semibold">
                            {user.name}
                        </h4>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        onClick={() =>
                                            handleDeleteSelectedItem(user._id)
                                        }
                                    >
                                        <X className="size-3 text-sm text-primary-blue" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{`Gỡ ${user.name}`}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ))}
            </ul>
            <Input
                className="!max-w-[80%] focus-visible:ring-0 border-none !pl-0 !bg-transparent text-sm h-[38px] rounded-none"
                value={searchTxt}
                onChange={handleChange}
            ></Input>
        </div>
    );
};

export default AddGroupInput;
