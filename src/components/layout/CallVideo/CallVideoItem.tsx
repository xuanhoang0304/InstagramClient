import { Mic, MicOff } from "lucide-react";
import Image from "next/image";
import { memo, RefObject, useEffect, useRef } from "react";

import { IGroup } from "@/features/chats/type";
import { cn } from "@/lib/utils";
import { User } from "@/types/types";

interface ICallVideoItemProps {
  allowMic: boolean;
  userInfo: User;
  groupChat: IGroup;
  allowCam: boolean;
  peersVideoRef: RefObject<Record<string, HTMLVideoElement | null>>;
}

const CallVideoItem = ({
  allowMic,
  userInfo,
  groupChat,
  allowCam,
  peersVideoRef,
}: ICallVideoItemProps) => {
  const bgClRef = useRef(
    `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256,
    )}, ${Math.floor(Math.random() * 256)})`,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  console.log("first", { allowCam, allowMic });
  useEffect(() => {
    // Gán videoRef vào peersVideoRef
    peersVideoRef.current[userInfo._id] = videoRef.current;
    return () => {
      delete peersVideoRef.current[userInfo._id];
    };
  }, [userInfo._id, allowCam]);

  return (
    <li
      style={{
        backgroundColor: bgClRef.current,
      }}
      className={cn(
        "w-full snap-start  aspect-square md:aspect-[2/3] xl:aspect-square shrink-0 relative rounded-lg flex items-center justify-center",
        !groupChat?.isGroup && "!h-full  rounded-none xl:h-full",
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={cn(
          "size-full object-cover rounded-lg",
          !allowCam && "hidden",
          allowCam && "block", // Đảm bảo hiển thị khi allowCam là true
        )}
        onError={(e) => console.error("Video error:", e)}
      />
      {!allowCam && (
        <figure className="size-[100px] md:size-[150px] lg:size-[200px] rounded-full">
          <Image
            src={userInfo.avatar || "/images/default.jpg"}
            alt="video-call-user-avt"
            width={200}
            height={200}
            className="size-full rounded-full object-cover"
          ></Image>
        </figure>
      )}
      <div className="p-2  absolute bottom-3 left-3 z-10 bg-second-button-background rounded-full">
        {allowMic ? (
          <Mic className="text-green-500 size-4 md:size-6" />
        ) : (
          <MicOff className="text-red-500 size-4 md:size-6" />
        )}
      </div>
      <p className="px-3 py-1 absolute right-3 text-xs font-semibold bottom-3 z-10 rounded-lg bg-second-button-background">
        {userInfo.name}
      </p>
    </li>
  );
};

export default memo(CallVideoItem);
