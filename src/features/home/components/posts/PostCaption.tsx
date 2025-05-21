import { useState } from 'react';

import MiniUserProfile from '@/features/home/components/posts/miniUser/MiniUserProfile';
import { PostProp } from '@/features/home/components/posts/type';
import { cn } from '@/lib/utils';

type PostCaptionProps = {
    showAvt?: boolean;
} & PostProp;
const PostCaption = ({ item, showAvt }: PostCaptionProps) => {
    const [showCaption, setShowCaption] = useState(false);
    return (
        <div
            className={cn(
                "flex gap-x-2",
                showAvt && "sticky z-10 py-2 top-0 left-4 bg-black"
            )}
        >
            {showAvt && (
                <MiniUserProfile user={item?.createdBy}></MiniUserProfile>
            )}

            <div className={cn(showAvt && "text-primary-white")}>
                <h3 className="text-sm font-semibold inline mr-2">
                    {item?.createdBy.name}
                </h3>
                {item?.isReel && (
                    <svg
                        aria-label="Đã xác minh"
                        className="x1lliihq x1n2onr6 inline mr-2"
                        fill="rgb(0, 149, 246)"
                        height="12"
                        role="img"
                        viewBox="0 0 40 40"
                        width="12"
                    >
                        <title>Đã xác minh</title>
                        <path
                            d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                )}
                <p
                    className={cn(
                        "text-sm inline",
                        showCaption && "line-clamp-none"
                    )}
                >
                    {showCaption
                        ? item?.caption
                        : item?.caption.slice(0, 100) +
                          (item?.caption && item?.caption?.length < 100
                              ? ""
                              : "...")}
                </p>
                <button
                    onClick={() => setShowCaption((prev) => !prev)}
                    className={cn(
                        "text-sm text-second-gray",
                        item?.caption && item?.caption.length < 100 && "hidden"
                    )}
                >
                    {showCaption ? "ẩn bớt" : "xem thêm"}
                </button>
            </div>
        </div>
    );
};

export default PostCaption;
