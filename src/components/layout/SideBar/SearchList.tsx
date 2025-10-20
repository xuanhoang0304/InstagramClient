import { memo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { tempArr } from "@/lib/utils";
import { User } from "@/types/types";

import SearchItem from "./SearchItem";

type Props = {
  list: User[];
  type?: "search-user" | "history-list";
  onAddToHistoryList?: (item: User) => void;
  isLoading?: boolean;
};

const SearchList = ({ list, type, isLoading, onAddToHistoryList }: Props) => {
  if (isLoading) {
    return (
      <ul className="size-full">
        {tempArr.slice(0, 7).map((item) => (
          <li key={item.id} className="px-4 py-2 flex items-center gap-x-3">
            <Skeleton className="size-11 rounded-full shrink-0"></Skeleton>
            <Skeleton className="h-5 w-full"></Skeleton>
          </li>
        ))}
      </ul>
    );
  }
  if (!list.length && !isLoading)
    return (
      <div className="flex items-center justify-center size-full min-h-[400px] ">
        <p className="text-second-gray text-sm">
          {type === "history-list"
            ? "Không có nội dung tìm kiếm gần đây"
            : "Không tìm thấy kết quả"}
        </p>
      </div>
    );
  return (
    <ul className="size-full overflow-y-auto hidden-scrollbar">
      {list.map((item) => (
        <SearchItem
          key={item._id}
          item={item}
          onAddToHistoryList={onAddToHistoryList}
          type={type}
        ></SearchItem>
      ))}
    </ul>
  );
};

export default memo(SearchList);
