"use client";
import { uniqBy } from "lodash";
import { usePathname } from "next/navigation";
import { memo, ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { useLocalStorage, useOnClickOutside } from "usehooks-ts";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import envConfig from "@/configs/envConfig";
import { SuggestionUserResponse } from "@/features/chat/chat boxs/AddGroupsChatBtn";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

import SearchInput from "./SearchInput";
import SearchList from "./SearchList";

type Props = {
  item: {
    icon: ReactNode;
    url: string;
    title: string;
    tooltip: string;
  };
  type: "short" | "normal";
  showDialog: string;
  onSetShowDialog: (type: "" | "notify" | "search") => void;
};

const SearchWrapper = ({ item, type, showDialog, onSetShowDialog }: Props) => {
  const pathname = usePathname();
  const [searchText, setSearchText] = useState("");
  const myUserId = useMyStore.getState().myUser?._id;
  const debounceSearchText = useDebounce(searchText, 500);
  const { data, isLoading } = useApi<SuggestionUserResponse>(
    debounceSearchText &&
      `${envConfig.BACKEND_URL}/api/users/?filters={"keyword": "${debounceSearchText}","excludes": ["${myUserId}"]}&page=1&limit=5`,
  );
  const [oldList, setValue] = useLocalStorage<User[]>("historyList", []);
  const [list, setList] = useState<User[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const handleSetList = (list: User[] | ((prev: User[]) => User[])) => {
    setList(list);
  };
  const handleAddToHistoryList = (item: User) => {
    if (oldList.find((u) => u._id === item._id)) return;
    const newList = uniqBy([...oldList, item], "_id");
    setValue(newList);
    onSetShowDialog("");
    setSearchText("");
  };
  const handleOpen = () => {
    onSetShowDialog("search");
  };
  const handleSetSearchText = (value: string) => {
    setSearchText(value);
  };
  useOnClickOutside(ref as RefObject<HTMLDivElement>, () =>
    onSetShowDialog(""),
  );
  useEffect(() => {
    if (!searchText) {
      setList(oldList);
      return;
    }
    if (data) {
      setList(data.result.users);
    }
  }, [data, searchText, list, oldList]);
  return (
    <Sheet open={showDialog === "search"}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="w-full">
            <SheetTrigger
              asChild
              onClick={handleOpen}
              className={cn("cursor-pointer")}
            >
              <button className="flex items-center p-3 gap-x-2 w-full">
                <div>{item.icon}</div>
                {type == "normal" && (
                  <p
                    className={cn(
                      "line-clamp-1 hidden lg:block",
                      pathname === item.url && "font-bold",
                      showDialog && "lg:hidden",
                    )}
                  >
                    {item.title}
                  </p>
                )}
              </button>
            </SheetTrigger>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            className={cn(!showDialog && type === "normal" && "hidden")}
          >
            <p>Tìm kiếm</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <SheetContent
        ref={ref}
        side="left"
        className="!bg-black !left-[72px] !border-primary-gray !border-2 !rounded-r-lg"
        overlayClassName="bg-transparent"
      >
        <SheetHeader className="py-6 border-b border-primary-gray">
          <SheetTitle className="text-2xl font-bold">Tìm kiếm</SheetTitle>
          <SearchInput
            searchText={searchText}
            onSetList={handleSetList}
            onSetSearchText={handleSetSearchText}
          ></SearchInput>
        </SheetHeader>

        {!searchText && (
          <div className="flex items-center justify-between px-4 text-sm font-bold">
            <span>Mới đây</span>
            {!!oldList.length && (
              <button
                onClick={() => {
                  setValue([]);
                  setList([]);
                }}
                className="text-second-blue hover:text-primary-blue hover:underline transition-all "
              >
                Xóa tất cả
              </button>
            )}
          </div>
        )}

        <SearchList
          list={list}
          type={searchText ? "search-user" : "history-list"}
          onAddToHistoryList={handleAddToHistoryList}
          isLoading={isLoading}
        ></SearchList>
      </SheetContent>
    </Sheet>
  );
};

export default memo(SearchWrapper);
