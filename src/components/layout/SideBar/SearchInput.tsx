import { Search, X } from "lucide-react";
import { memo, useEffect } from "react";

import { Label } from "@/components/ui/label";
import { User } from "@/types/types";

type Props = {
  searchText: string;
  onSetList: (list: User[] | ((prev: User[]) => User[])) => void;
  onSetSearchText: (value: string) => void;
};
const SearchInput = ({ onSetList, onSetSearchText, searchText }: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSetSearchText(e.target.value);
  };
  useEffect(() => {
    if (!searchText) {
      onSetList([]);
    }
  }, [searchText]);
  return (
    <div className="px-2 rounded-lg flex items-center gap-x-2 bg-primary-gray/50 mt-6">
      <input
        type="text"
        className="w-full h-10 outline-none  peer order-2"
        id="search-input"
        placeholder="Tìm kiếm..."
        autoComplete="off"
        value={searchText}
        onChange={handleChange}
      />
      <Label
        htmlFor="search-input"
        className="peer-not-placeholder-shown:hidden order-1"
      >
        <Search className=" text-second-gray  size-4" />
      </Label>
      <button
        onClick={() => onSetSearchText("")}
        className="order-3 p-1 bg-primary-gray rounded-full peer-placeholder-shown:hidden"
      >
        <X className="text-second-gray size-3" />
      </button>
    </div>
  );
};

export default memo(SearchInput);
