import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { memo, RefObject, useEffect, useMemo, useRef, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useOnClickOutside } from "usehooks-ts";

import { Media } from "@/components/layout/SideBar/type";

import MediaItem from "./MediaItem";
import MediaSwipperHeading from "./MediaSwipperHeading";

interface Props {
  mediaList: Media[];
  onSetShowSwipper: (show: boolean) => void;
}
const MediaSwipper = ({ mediaList, onSetShowSwipper }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const groupId = useParams().groupId;
  const handleClose = () => {
    onSetShowSwipper(false);
    router.push(`/chats/${groupId}`);
  };
  const router = useRouter();
  const pathname = usePathname();
  const mediaUrl = useSearchParams().get("media");
  const initialSlideMemozied = useMemo(() => {
    const index = mediaList.findIndex((item) => item.path === mediaUrl);
    return index !== -1 ? index : 0;
  }, [mediaList, mediaUrl]);
  const handleSlideChange = () => {
    if (!mainSwiperRef.current) return;
    router.push(
      `${pathname}?media=${mediaList[mainSwiperRef.current?.realIndex].path}`,
    );
  };
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
  useEffect(() => {
    if (mainSwiperRef.current && mediaList.length > 0) {
      mainSwiperRef.current.slideTo(initialSlideMemozied, 0);
    }
  }, [initialSlideMemozied, mediaList]);
  return (
    <div className="bg-black xl:bg-black/80 fixed z-51 inset-0 flex items-center justify-center">
      <div
        ref={ref}
        className="h-[80%] max-w-full xl:max-w-1/3 mx-auto  flex flex-col items-center justify-center gap-y-4"
      >
        <Swiper
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper; // lưu instance
          }}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper max-w-full flex-2/3"
          onSlideChange={handleSlideChange}
        >
          {mediaList.map((media) => (
            <SwiperSlide
              key={media.path}
              className="border-2 border-primary-gray"
            >
              <MediaSwipperHeading media={media}></MediaSwipperHeading>
              <MediaItem
                media={media}
                width={500}
                height={500}
                videoSetting={{
                  muted: true,
                  controls: true,
                }}
                mediaClassname="!h-[calc(100%-72px)]"
              ></MediaItem>
            </SwiperSlide>
          ))}
        </Swiper>
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={0}
          slidesPerView={4}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper2 max-w-full"
        >
          {mediaList.map((media) => (
            <SwiperSlide
              key={media.path}
              className="cursor-pointer mr-0! !shrink-0 aspect-square"
            >
              <MediaItem media={media} width={500} height={500}></MediaItem>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default memo(MediaSwipper);
