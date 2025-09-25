import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from "next/image";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { PostProp } from "@/features/home/components/posts/type";
import { cn } from "@/lib/utils";

type PostItemMediaProps = {
  className?: string;
  figureClassName?: string;
  imageClassName?: string;
  videoClassName?: string;
} & PostProp;
const PostItemMedia = ({
  item,
  className,
  figureClassName,
  imageClassName,
  videoClassName,
}: PostItemMediaProps) => {
  return (
    <>
      {!item?.isReel ? (
        <Swiper
          pagination={true}
          navigation={true}
          keyboard={true}
          modules={[Pagination, Navigation, Keyboard]}
          className={cn("PostItemSwiper  rounded-[4px]", className)}
        >
          {item?.media.map((item) => (
            <SwiperSlide className="rounded-[4px]" key={item.path}>
              <figure
                className={cn(
                  "md:w-[468px] md:h-full aspect-square rounded-[4px]",
                  figureClassName,
                )}
              >
                <Image
                  width={600}
                  height={1000}
                  src={item.path}
                  alt="post-createdBy-avt"
                  className={cn(
                    "size-full object-cover rounded-[4px]",
                    imageClassName,
                  )}
                ></Image>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <video
          className={cn(
            "md:w-[468px] aspect-square object-cover  dark:border border-[#262626] mt-3",
            videoClassName,
          )}
          src={`${item.media[0].path}?w=400&q=auto&f=auto`}
          controls
          preload="metadata"
          muted
          playsInline
          poster={item.media[0].thumbnailUrl}
          width={468}
          height={585}
        ></video>
      )}
    </>
  );
};

export default PostItemMedia;
