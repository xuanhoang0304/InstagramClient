import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { memo } from "react";

import { Media } from "@/components/layout/SideBar/type";
import { IGroup } from "@/features/chat/type";

import { mediaResponseItem } from "./GroupChatMediaList";
import MediaItem from "./MediaItem";

type Props = {
  item: mediaResponseItem;
  group: IGroup;
  onSetShowSwipper: (show: boolean) => void;
};

const GroupChatMediaItem = ({ item, group, onSetShowSwipper }: Props) => {
  const router = useRouter();
  const handleClickMedia = (media: Media) => {
    router.push(`/chats/${group._id}?media=${media.path}`);
    onSetShowSwipper(true);
  };
  return (
    <li>
      <p className="text-sm font-semibold text-second-gray">
        {dayjs(item._id, "DD-MM-YYYY").format("D [tháng] M, YYYY")}
      </p>
      <div className="meidaList grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2 my-3">
        {item.media.map((media) => (
          <div
            key={media.path}
            className="aspect-square size-full cursor-pointer"
            onClick={() => handleClickMedia(media)}
          >
            <MediaItem media={media} width={200} height={200}></MediaItem>
          </div>
        ))}
      </div>
    </li>
  );
};

export default memo(GroupChatMediaItem);
