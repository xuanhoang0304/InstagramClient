import { memo, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { Media } from "@/components/layout/SideBar/type";
import { Skeleton } from "@/components/ui/skeleton";
import { IGroup } from "@/features/chat/type";
import { useApi } from "@/hooks/useApi";
import { tempArr } from "@/lib/utils";
import { HttpResponse } from "@/types/types";

import GroupChatMediaItem from "./GroupChatMediaItem";
import MediaSwipper from "./MediaSwipper";

interface Props {
  group: IGroup;
}
export interface mediaResponseItem {
  _id: string;
  media: Media[];
  totalMedia: number;
}
interface getMediaResponse extends HttpResponse {
  result: {
    list: mediaResponseItem[];
    totalMedia: number;
  };
}
const GroupChatMediaSkeleton = () => {
  return (
    <li>
      <Skeleton className="w-full h-5"></Skeleton>
      <div className="flex-1 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 my-3">
        {tempArr.slice(0, 5).map((item) => (
          <Skeleton
            key={item.id}
            className="aspect-square size-full cursor-pointer"
          ></Skeleton>
        ))}
      </div>
    </li>
  );
};

const GroupChatMediaList = ({ group }: Props) => {
  const [page, setPage] = useState(1);
  const [totalMedia, setTotalMedia] = useState(0);
  const { data, isLoading } = useApi<getMediaResponse>(
    `/chats/media/group/${group._id}?page=${page}&limit=2`,
  );

  const [mediaResponseList, setMediaResponseList] = useState<
    mediaResponseItem[]
  >([]);
  const [showSwipper, setShowSwipper] = useState(false);
  const [mediaList, setMediaList] = useState<Media[]>([]);

  const fetchMoreData = async () => {
    setPage((prev) => prev + 1);
  };
  const handleSetShowSwipper = (show: boolean) => {
    setShowSwipper(show);
  };

  useEffect(() => {
    if (!data?.result || data.result.list.length === 0) {
      return;
    }
    const newMedia: Media[] = [];
    data?.result.list.forEach((item) => {
      newMedia.push(...item.media);
    });
    setMediaList((prev) => [...prev, ...newMedia]);
    setMediaResponseList((prev) => [...prev, ...data.result.list]);
    if (!totalMedia) {
      setTotalMedia(data.result.totalMedia);
    }
  }, [data, page]);

  if (isLoading && !mediaResponseList.length) {
    return (
      <ul className="p-4">
        {tempArr.slice(0, 2).map((item) => (
          <GroupChatMediaSkeleton key={item.id}></GroupChatMediaSkeleton>
        ))}
      </ul>
    );
  }
  if (!data?.result.list.length && !mediaResponseList.length) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p>Không có media nào</p>
      </div>
    );
  }

  return (
    <>
      <div id="mediaScrollableDiv" className="p-4 overflow-y-auto">
        <InfiniteScroll
          dataLength={mediaList.length}
          next={fetchMoreData}
          hasMore={mediaList.length < totalMedia}
          loader={
            isLoading && <GroupChatMediaSkeleton></GroupChatMediaSkeleton>
          }
          scrollableTarget="mediaScrollableDiv"
          scrollThreshold={0.9}
        >
          <ul>
            {mediaResponseList.map((item) => (
              <GroupChatMediaItem
                key={item._id}
                group={group}
                item={item}
                onSetShowSwipper={handleSetShowSwipper}
              ></GroupChatMediaItem>
            ))}
          </ul>
        </InfiniteScroll>
      </div>
      {!!mediaList.length && showSwipper && (
        <MediaSwipper
          mediaList={mediaList}
          onSetShowSwipper={handleSetShowSwipper}
        ></MediaSwipper>
      )}
    </>
  );
};

export default memo(GroupChatMediaList);
