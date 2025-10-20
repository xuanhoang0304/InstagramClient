import Image from "next/image";
import { memo } from "react";

import RealUsername from "@/components/layout/RealUsername";
import { Media } from "@/components/layout/SideBar/type";

type Props = {
  media: Media;
};

const MediaSwipperHeading = ({ media }: Props) => {
  return (
    <div className="py-4 px-2 flex items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <figure className="size-[40px] rounded-full">
          <Image
            src={media.sender?.avatar || "/images/default.jpb"}
            alt="sender-avt"
            width={50}
            height={50}
            className="size-full object-cover rounded-full"
          ></Image>
        </figure>
        <RealUsername
          isReal={!!media.sender?.isReal}
          username={media.sender?.name as string}
        ></RealUsername>
      </div>
    </div>
  );
};

export default memo(MediaSwipperHeading);
