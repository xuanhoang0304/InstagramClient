import { ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';

type AddGroupInputProps = {
    searchTxt: string;
    onSetSearchTxt: (txt: string) => void;
};
const AddGroupInput = ({ searchTxt, onSetSearchTxt }: AddGroupInputProps) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onSetSearchTxt(e.target.value);
    };
    return (
        <div className="border-y  flex items-center py-1 mt-3 ">
            <p className="px-3 font-semibold">Tới:</p>
            <Input
                className="focus-visible:ring-0 border-none !pl-0 !bg-transparent text-sm h-[38px] rounded-none"
                value={searchTxt}
                onChange={handleChange}
            ></Input>
        </div>
    );
};

export default AddGroupInput;
