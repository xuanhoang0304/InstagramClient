import { apiClient } from "@/configs/axios";
import MiniUserActions from "@/features/home/components/posts/miniUser/MiniUserActions";
import MiniUserDetails from "@/features/home/components/posts/miniUser/MiniUserDetails";
import MiniUserInfo from "@/features/home/components/posts/miniUser/MiniUserInfo";
import MiniUserPosts from "@/features/home/components/posts/miniUser/MiniUserPosts";
import { PostProp } from "@/features/home/components/posts/type";

import { handleFollowingUser } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { IPost, User } from "@/types/types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
type getPostsByCreated = {
    result: IPost[];
    total: number;
};
type MiniUserProfileProps = {
    user: User;
    onSetPosts: (post: IPost) => void;
} & PostProp;
const MiniUserProfile = ({ item, onSetPosts, user }: MiniUserProfileProps) => {
    const { setMyUser } = useMyStore();
    const [showMiniUser, setShowMiniUser] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [posts, setPosts] = useState<IPost[]>([]);
    const figureRef = useRef<HTMLElement>(null);
    const handleGetPostsByCreated = async (createdBy: string) => {
        try {
            const data: getPostsByCreated = await apiClient.fetchApi(
                `/posts/?filters={"createdBy": ["${createdBy}"]}`
            );
            setPosts(data.result);
        } catch (error) {
            console.log("error", error);
        }
    };
    const handlFollowOrUnFollow = async (id: string) => {
        const data = await handleFollowingUser(id);
        if (data?.code === 200) {
            setMyUser(data.data);
        }
        const newPost: IPost = await apiClient.fetchApi(`/posts/${item._id}`);
        onSetPosts?.(newPost);
    };
    const handleHideUser = () => {
        setShowMiniUser(false);
    };
    const handleShowUser = () => {
        if (figureRef.current) {
            const rect = figureRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top + window.scrollY + rect.width ,
                left: rect.left + window.scrollX,
            });
        }
        setShowMiniUser(true);
    };
    useEffect(() => {
        handleGetPostsByCreated(user._id);
    }, [user._id]);
    return (
        <>
            <figure
                ref={figureRef}
                onMouseEnter={handleShowUser}
                onMouseLeave={handleHideUser}
                className="size-8 rounded-full cursor-pointer shrink-0"
            >
                <Image
                    width={32}
                    height={32}
                    src={user.avatar || "/images/default.jpg"}
                    alt="post-createdBy-avt"
                    className="size-full object-cover rounded-full"
                ></Image>
            </figure>
            {showMiniUser &&
                createPortal(
                    <div
                        onMouseEnter={handleShowUser}
                        onMouseLeave={handleHideUser}
                        style={{
                            top: position.top,
                            left: position.left,
                        }}
                        className="absolute rounded-lg dark:!bg-black !bg-white py-4 !px-0 z-20 shadow-[0_0_23px_0_rgba(255,255,255,0.2)] !w-auto min-w-[366px] !border-none"
                    >
                        {/* Info */}
                        <MiniUserInfo user={user}></MiniUserInfo>
                        {/* Detail */}
                        <div className="mt-4 flex justify-evenly gap-x-4 px-4">
                            <MiniUserDetails
                                quantity={posts.length}
                                desc="bài viết"
                            ></MiniUserDetails>
                            <MiniUserDetails
                                quantity={user.followers?.length || 0}
                                desc="người theo dõi"
                            ></MiniUserDetails>
                            <MiniUserDetails
                                quantity={user.followings?.length || 0}
                                desc="đang theo dõi"
                            ></MiniUserDetails>
                        </div>
                        {/* Posts */}
                        <MiniUserPosts posts={posts}></MiniUserPosts>
                        {/* Actions */}
                        <MiniUserActions
                            user={user}
                            onFollowOrUnFollow={handlFollowOrUnFollow}
                        ></MiniUserActions>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default MiniUserProfile;
