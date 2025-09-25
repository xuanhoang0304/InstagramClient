"use client";

import { AnimatePresence, motion } from "motion/react"; // thêm AnimatePresence
import Image from "next/image";
import { RefObject, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { cn, handleFollowingUser, handleMutateWithKey } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { getPostsByCreated, IPost, User } from "@/types/types";

import MiniUserActions from "./MiniUserActions";
import MiniUserDetails from "./MiniUserDetails";
import MiniUserInfo from "./MiniUserInfo";
import MiniUserPosts from "./MiniUserPosts";

interface ModalMiniUserProfileProps {
  user: User;
  imageWrapperClass?: string;
  imageClass?: string;
  profileContentClass?: string;
  imageSize?: number;
}

const ModalMiniUserProfile = ({
  user,
  imageWrapperClass,
  imageClass,
  imageSize,
  profileContentClass,
}: ModalMiniUserProfileProps) => {
  const { setMyUser } = useMyStore();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [posts, setPosts] = useState<IPost[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);

  const { data: userPost } = useApi<getPostsByCreated>(
    `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${user?._id}"]}&limit=3&page=1&sorts={ "pinned": -1, "createdAt":-1}`,
  );

  const handlFollowOrUnFollow = async (id: string) => {
    const data = await handleFollowingUser(id);
    if (data?.code === 200) {
      handleMutateWithKey("/users");
      setMyUser(data.data);
    }
  };

  useEffect(() => {
    if (userPost) setPosts(userPost.result);
  }, [user?._id, userPost]);

  return (
    <>
      <figure
        onClick={handleOpen}
        className={cn(
          "size-8 rounded-full relative cursor-pointer shrink-0",
          imageWrapperClass,
          open && "pointer-events-none",
        )}
      >
        <Image
          width={imageSize || 32}
          height={imageSize || 32}
          src={user?.avatar || "/images/default.jpg"}
          alt="post-createdBy-avt"
          className={cn("size-full object-cover rounded-full", imageClass)}
        />
      </figure>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "absolute top-10 left-0 right-0 rounded-lg dark:!bg-black !bg-white py-4 !px-0 z-[51] shadow-[0_0_23px_0_rgba(255,255,255,0.2)] w-full md:w-auto min-w-[300px] !border-none",
              profileContentClass,
            )}
          >
            {/* Info */}
            <MiniUserInfo user={user} />

            {/* Detail */}
            <div className="mt-4 flex justify-evenly gap-x-4 px-4">
              <MiniUserDetails quantity={posts.length} desc="bài viết" />
              <MiniUserDetails
                quantity={user?.followers?.length || 0}
                desc="người theo dõi"
              />
              <MiniUserDetails
                quantity={user?.followings?.length || 0}
                desc="đang theo dõi"
              />
            </div>

            {/* Posts */}
            <MiniUserPosts posts={posts} />

            {/* Actions */}
            <MiniUserActions
              user={user}
              onFollowOrUnFollow={handlFollowOrUnFollow}
              modal
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModalMiniUserProfile;
