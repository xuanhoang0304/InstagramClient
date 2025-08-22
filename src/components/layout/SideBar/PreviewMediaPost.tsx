import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { CircleAlert } from 'lucide-react';
import Image from 'next/image';
import { ReactNode, useCallback, useMemo } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Media } from './type';

type PreviewMediaPostProps = {
    imageUrls: Media[];
    onSetStep: (step: number) => void;
};
export function PreviewMediaPost({
    imageUrls,
    onSetStep,
}: PreviewMediaPostProps) {
    const mappingMedia: Record<string, ReactNode> = useMemo(
        () => ({
            image: (
                <figure className="md:size-[400px] w-full mx-auto">
                    <Image
                        src={imageUrls[0]?.path || ""}
                        alt={`Preview media`}
                        className="size-full object-cover "
                        width={500}
                        height={500}
                    />
                </figure>
            ),
            video: (
                <video
                    className="w-full h-auto object-cover rounded"
                    src={imageUrls[0]?.path || ""}
                    controls
                    autoPlay
                    muted
                ></video>
            ),
            images: (
                <Swiper
                    centeredSlides={true}
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="PreviewMediaPostSwiper md:w-full max-h-[500px] w-[280px] !m-0"
                >
                    {imageUrls.map((item) => (
                        <SwiperSlide
                            key={item.path}
                            className="!h-auto select-none"
                        >
                            <figure className="size-full ">
                                <Image
                                    src={item.path}
                                    alt={`Preview ${item.path}`}
                                    className="size-full object-cover "
                                    width={500}
                                    height={500}
                                />
                            </figure>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ),
            invalid: (
                <div className=" text-center flex justify-center items-center">
                    <div>
                        <CircleAlert className="size-[100px] mx-auto" />
                        <h3 className="text-xl font-semibold  mt-4">
                            Số lượng hoặc kích thước file bạn chọn không hợp lệ
                        </h3>
                        <p className="text-sm text-second-gray mt-3">
                            Mỗi bài đăng chỉ được tối đa 1 video hoặc 10 ảnh.
                            Kích thước mỗi file ảnh không được lớn hơn 2MB. Kích
                            thước mỗi file video không được lớn hơn 5MB.
                        </p>
                        <button
                            onClick={() => onSetStep(0)}
                            className="hover:bg-primary-blue bg-second-blue px-4 py-1 min-w-[120px] rounded-lg mt-4 transition-colors"
                        >
                            Trở về
                        </button>
                    </div>
                </div>
            ),
        }),
        [imageUrls, onSetStep]
    );
    const handlePreviewMedia = useCallback(() => {
        if (imageUrls.length === 0) return mappingMedia.invalid;
        if (imageUrls.length > 1) return mappingMedia.images;
        return mappingMedia[imageUrls[0]?.type || ""];
    }, [imageUrls, mappingMedia]);

    return handlePreviewMedia();
}
