// Import Swiper styles

import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import Image from "next/image";
import { useState } from "react";
import { Swiper as SwiperType } from "swiper";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

import { Media } from "@/components/layout/SideBar/type";

interface Props {
  media: Media[];
}
export default function MessageMediaDialog({ media }: Props) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Swiper
        navigation={true}
        spaceBetween={20}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="h-full md:!w-[500px] mx-auto rounded-lg w-[90%]"
      >
        {media.map((item) => {
          if (item.type === "image") {
            return (
              <SwiperSlide key={item.path} className="!size-full rounded-lg">
                <figure className="!size-full rounded-lg">
                  <Image
                    src={item.path}
                    alt="media item"
                    width={1000}
                    height={1000}
                    className="size-full object-cover rounded-lg"
                  ></Image>
                </figure>
              </SwiperSlide>
            );
          }
          return (
            <SwiperSlide key={item.path}>
              <video
                className="size-full bg-black rounded-lg"
                src={item.path}
                controls
              ></video>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {media.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={3}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="!shrink-0 md:!w-[500px] mx-auto w-[90%]"
        >
          {media.map((item) => {
            if (item.type === "image") {
              return (
                <SwiperSlide
                  key={item.path}
                  className="!size-[100px] cursor-pointer shrink-0 flex-1 aspect-square rounded-lg"
                >
                  <figure className="!size-full rounded-lg">
                    <Image
                      src={item.path}
                      alt="media item"
                      width={100}
                      height={100}
                      className="size-full object-cover rounded-lg"
                    ></Image>
                  </figure>
                </SwiperSlide>
              );
            }
            return (
              <SwiperSlide key={item.path} className="shrink-0 flex-1">
                <video
                  className="size-full bg-blacka cursor-pointer rounded-lg"
                  src={item.path}
                  // poster='/images/default.jpg'
                ></video>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </>
  );
}
