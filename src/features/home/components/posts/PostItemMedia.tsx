import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Image from 'next/image';
import { Keyboard, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { PostProp } from '@/features/home/components/posts/type';
import { cn } from '@/lib/utils';

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
                                    "w-[468px] h-[585px] rounded-[4px]",
                                    figureClassName
                                )}
                            >
                                <Image
                                    width={600}
                                    height={1000}
                                    src={item.path}
                                    alt="post-createdBy-avt"
                                    className={cn(
                                        "size-full object-cover rounded-[4px]",
                                        imageClassName
                                    )}
                                ></Image>
                            </figure>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <div
                    className={cn(
                        "w-[468px]  dark:border border-[#262626] mt-3",
                        videoClassName
                    )}
                >
                    <video
                        className={" rounded-[4px] size-full object-contain "}
                        src={item.media[0].path}
                        controls
                        autoPlay={true}
                        muted={true}
                    ></video>
                </div>
            )}
        </>
    );
};

export default PostItemMedia;
