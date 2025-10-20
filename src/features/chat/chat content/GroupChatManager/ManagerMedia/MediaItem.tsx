import Image from "next/image";
import { memo, VideoHTMLAttributes } from "react";

import { Media } from "@/components/layout/SideBar/type";
import { cn } from "@/lib/utils";

type Props = {
  media: Media;
  width?: number;
  height?: number;
  mediaClassname?: string;
  videoSetting?: VideoHTMLAttributes<HTMLVideoElement>;
};

const MediaItem = ({
  media,
  width = 100,
  height = 100,
  mediaClassname,
  videoSetting,
}: Props) => {
  if (media.type === "video") {
    return (
      <video
        src={media.path}
        className={cn("size-full object-cover", mediaClassname)}
        {...videoSetting}
      ></video>
    );
  }
  return (
    <Image
      src={media.path || "/images/default.jpg"}
      alt="media-item-img"
      width={width}
      height={height}
      className={cn("size-full object-cover", mediaClassname)}
    ></Image>
  );
};
export default memo(MediaItem);
