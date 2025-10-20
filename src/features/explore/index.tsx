"use client";
import { uniqBy } from "lodash";
import chunk from "lodash/chunk";
import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";

import SearchList from "@/components/layout/SideBar/SearchList";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, handleMutateWithKey, tempArr } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { getExlorePost, IPost, User } from "@/types/types";

import { SuggestionUserResponse } from "../chat/chat boxs/AddGroupsChatBtn";
import ExploreList from "./ExploreList";

const ExplorePage = () => {
  const [searchText, setSearchText] = useState("");
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [oldList, setValue] = useLocalStorage<User[]>("historyList", []);
  const myUserId = useMyStore.getState().myUser?._id;
  const [excludes, setExcludes] = useState<string[] | []>([]);
  const [oldPosts, setOldPosts] = useState<IPost[] | []>([]);
  const [list, setList] = useState<IPost[][] | []>([]);
  const [searchUserList, setSearchUserList] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const debounceSearchText = useDebounce(searchText, 300);
  const { data: searchUser, isLoading: isLoadingSearchUser } =
    useApi<SuggestionUserResponse>(
      debounceSearchText &&
        `${envConfig.BACKEND_URL}/api/users/?filters={"keyword": "${debounceSearchText}","excludes": ["${myUserId}"]}&page=1&limit=5`,
    );
  const limit = 20;
  const { data, isLoading } = useApi<getExlorePost>(
    `${envConfig.BACKEND_URL}/api/posts/discover?filters={"excludes": [${excludes}]}&limit=${limit}`,
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const handleAddToHistoryList = (item: User) => {
    if (oldList.find((u) => u._id === item._id)) return;
    const newList = uniqBy([...oldList, item], "_id");
    setValue(newList);
  };
  const handleFetchMore = async () => {
    if (data) {
      const excludesId = data.result.map((item) => `"${item._id}"`);
      setExcludes((prev) => [...prev, ...excludesId]);
    }
  };
  const pathname = usePathname();
  useEffect(() => {
    if (searchUser) {
      setSearchUserList(searchUser.result.users);
    }
  }, [searchUser]);
  useEffect(() => {
    if (data && data.result.length) {
      if (!list?.length) {
        const chunkArr = chunk(data.result, 5);
        setList(chunkArr);
        setOldPosts(data.result);
        setTotal(data.total);
        return;
      }

      const chunkArr = chunk([...oldPosts, ...data.result], 5);
      setList(chunkArr);
      setOldPosts((prev) => [...prev, ...data.result]);
      return;
    }
  }, [data]);
  useEffect(() => {
    if (pathname === "/explore") {
      handleMutateWithKey(`/posts/discover?filters={"excludes`);
      setExcludes([]);
      setList([]);
      setOldPosts([]);
    }
  }, [pathname]);
  if (isLoading) {
    return (
      <div className="size-full">
        <Skeleton className="w-full h-[56px] rounded-none md:hidden"></Skeleton>
        <div className="flex-1 w-full md:py-10 mt-2 pb-10 flex flex-col gap-0.5">
          {tempArr.slice(0, Math.ceil(limit / 5)).map((item, index) => {
            const isOdd = index % 2 === 0;
            return (
              <div
                key={item.id}
                className={cn(
                  "w-full md:w-[90%] lg:w-[80%] mx-auto flex gap-0.5",
                  !isOdd && "flex-row-reverse",
                )}
              >
                <Skeleton className="flex-1/3 rounded-none"></Skeleton>
                <div className="grid grid-cols-2 gap-0.5 flex-2/3">
                  {tempArr.slice(0, 4).map((i) => (
                    <Skeleton
                      key={i.id}
                      className="aspect-square size-full rounded-none"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="size-full min-h-[100vh]">
      {isMobile && (
        <div className="bg-primary-gray sticky top-0 z-10 py-2">
          <div className="px-2 flex items-center gap-x-2 ">
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
              onClick={() => setSearchText("")}
              className="order-3 p-1 bg-primary-gray rounded-full peer-placeholder-shown:hidden"
            >
              <X className="text-second-gray size-3" />
            </button>
          </div>
        </div>
      )}
      {searchText ? (
        <div className="flex flex-col gap-y-3 h-[calc(100vh-60px)]">
          {!!oldList.length && (
            <div>
              <p className="text-second-gray text-sm font-semibold my-3 pl-2">
                Tìm kiếm gần đây
              </p>
              <SearchList list={oldList} type="history-list"></SearchList>
            </div>
          )}
          <div className="h-full">
            <p className="text-second-gray text-sm font-semibold my-3 pl-2">
              Kết quả tìm kiếm
            </p>
            <div className="relative">
              <SearchList
                list={searchUserList}
                type="search-user"
                onAddToHistoryList={handleAddToHistoryList}
                isLoading={isLoadingSearchUser}
              ></SearchList>
            </div>
          </div>
        </div>
      ) : !!list.length ? (
        <div className="InfiniteScroll-wrapper mt-2">
          <InfiniteScroll
            dataLength={oldPosts.length}
            next={handleFetchMore}
            hasMore={oldPosts.length < total}
            loader={
              isLoading && (
                <div className="w-full md:w-[90%] lg:w-[80%] mx-auto flex gap-0.5">
                  <Skeleton className="flex-1/3 rounded-none"></Skeleton>
                  <div className="grid grid-cols-2 gap-0.5 flex-2/3">
                    {tempArr.slice(0, 4).map((i) => (
                      <Skeleton
                        key={i.id}
                        className="aspect-square size-full rounded-none"
                      />
                    ))}
                  </div>
                </div>
              )
            }
            scrollThreshold={"50px"}
            endMessage={
              <p className="text-center mt-3">
                <b>Không còn bài viết nào</b>
              </p>
            }
            className="flex-1 w-full pb-[80px]"
          >
            <ExploreList list={list}></ExploreList>
          </InfiniteScroll>
        </div>
      ) : (
        <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
          <p>Không có bài viết nào</p>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
