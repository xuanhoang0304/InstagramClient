import Image from "next/image";
import { useEffect, useState } from "react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import envConfig from "@/configs/envConfig";
import MiniUserActions from "@/features/home/components/posts/miniUser/MiniUserActions";
import MiniUserDetails from "@/features/home/components/posts/miniUser/MiniUserDetails";
import MiniUserInfo from "@/features/home/components/posts/miniUser/MiniUserInfo";
import MiniUserPosts from "@/features/home/components/posts/miniUser/MiniUserPosts";
import { useApi } from "@/hooks/useApi";
import { handleFollowingUser, handleMutateWithKey } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { getPostsByCreated, IPost, User } from "@/types/types";

type MiniUserProfileProps = {
  user: User | undefined;
};
const MiniUserProfile = ({ user }: MiniUserProfileProps) => {
  const { setMyUser } = useMyStore();
  const [posts, setPosts] = useState<IPost[]>([]);
  const { data: userPost } = useApi<getPostsByCreated>(
    `${envConfig.BACKEND_URL}/api/posts?filters={"createdBy": ["${user?._id}"]}&limit=3&page=1&sorts={ "pinned": -1, "createdAt":-1}`,
    undefined,
    {
      dedupingInterval: 1000 * 60,
    },
  );

  const handlFollowOrUnFollow = async (id: string) => {
    const data = await handleFollowingUser(id);
    if (data?.code === 200) {
      handleMutateWithKey("/users");
      setMyUser(data.data);
    }
  };

  useEffect(() => {
    if (userPost) {
      setPosts(userPost.result);
    }
  }, [user?._id, userPost]);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <figure className="size-8 rounded-full cursor-pointer shrink-0">
          <Image
            width={32}
            height={32}
            src={user?.avatar || "/images/default.jpg"}
            alt="post-createdBy-avt"
            className="size-full object-cover rounded-full"
          ></Image>
        </figure>
      </HoverCardTrigger>
      <HoverCardContent className="absolute max-w-[400px] rounded-lg dark:!bg-black !bg-white py-4 !px-0  shadow-[0_0_23px_0_rgba(255,255,255,0.2)] !w-auto min-w-[340px] !border-none">
        {/* Info */}
        <MiniUserInfo user={user}></MiniUserInfo>
        {/* Detail */}
        <div className="mt-4 flex justify-evenly gap-x-4 px-4">
          <MiniUserDetails
            quantity={posts.length}
            desc="bài viết"
          ></MiniUserDetails>
          <MiniUserDetails
            quantity={user?.followers?.length || 0}
            desc="người theo dõi"
          ></MiniUserDetails>
          <MiniUserDetails
            quantity={user?.followings?.length || 0}
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
      </HoverCardContent>
    </HoverCard>
  );
};

export default MiniUserProfile;
