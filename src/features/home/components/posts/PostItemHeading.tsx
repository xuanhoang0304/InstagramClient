import { apiClient } from "@/configs/axios";
import MiniUserProfile from "@/features/home/components/posts/miniUser/MiniUserProfile";
import PostReportModal from "@/features/home/components/posts/PostReportModal";
import { PostProp } from "@/features/home/components/posts/type";
import { cn, getRelativeTime, handleFollowingUser } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IPost } from "@/types/types";
import { Dot } from "lucide-react";
import Link from "next/link";
type PostItemHeadingProps = {
    isShowTime: boolean;
    onSetPosts: (post: IPost) => void;
    className?: string;
} & PostProp;
const PostItemHeading = ({
    item,
    onSetPosts,
    className,
    isShowTime,
}: PostItemHeadingProps) => {
    const { myUser, setMyUser } = useMyStore();
    const hanndleFollowUser = async (userId: string) => {
        const data = await handleFollowingUser(userId);
        if (data?.code === 200) {
            setMyUser(data?.data);
        }
        const newPost: IPost = await apiClient.fetchApi(`/posts/${item._id}`);
        onSetPosts?.(newPost);
    };
    return (
        <div className={cn("flex items-center justify-between", className)}>
            <div className="flex items-center gap-x-2 relative">
                {/* avt */}
                <MiniUserProfile
                    user={item.createdBy}
                    item={item}
                    onSetPosts={onSetPosts}
                ></MiniUserProfile>
                {/* name */}
                <div className="flex items-center gap-x-1">
                    <Link href={""}>
                        <h3 className="text-sm font-semibold">
                            {item.createdBy.name}
                        </h3>
                    </Link>
                    {item.isReel && (
                        <svg
                            aria-label="Đã xác minh"
                            className="x1lliihq x1n2onr6"
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
                </div>
                {/* time */}
                {isShowTime && (
                    <div className="flex items-center">
                        <Dot className="size-4" />

                        <p className="text-sm text-second-gray">
                            {getRelativeTime(String(item.createdAt))}
                        </p>
                    </div>
                )}
                {!myUser?.followings.includes(item.createdBy._id) && (
                    <button
                        onClick={async () =>
                            hanndleFollowUser(item.createdBy._id)
                        }
                        className="text-sm font-semibold text-primary-blue hover:text-primary-blue-hover"
                    >
                        Theo dõi
                    </button>
                )}
            </div>
            <PostReportModal
                item={item}
                onSetPosts={onSetPosts}
            ></PostReportModal>
        </div>
    );
};

export default PostItemHeading;
