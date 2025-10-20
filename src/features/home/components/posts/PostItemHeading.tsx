import { Dot } from "lucide-react";
import Link from "next/link";

import RealUsername from "@/components/layout/RealUsername";
import MiniUserProfile from "@/features/home/components/posts/miniUser/MiniUserProfile";
import PostReportModal from "@/features/home/components/posts/PostReportModal";
import { PostProp } from "@/features/home/components/posts/type";
import {
  cn,
  getRelativeTime,
  handleFollowingUser,
  handleMutateWithKey,
} from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

import ModalMiniUserProfile from "./miniUser/ModalMiniUserProfile";
import ModalReportBtn from "./postModal/ModalReportBtn";

type PostItemHeadingProps = {
  isShowTime: boolean;
  className?: string;
  modal: boolean;
} & PostProp;
const PostItemHeading = ({
  item,
  className,
  isShowTime,
  modal,
}: PostItemHeadingProps) => {
  const { myUser, setMyUser } = useMyStore();
  const hanndleFollowUser = async (userId: string) => {
    const data = await handleFollowingUser(userId);
    if (data?.code === 200) {
      handleMutateWithKey("/users");
      setMyUser(data?.data);
    }
  };
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div
        className={cn(
          "flex items-center gap-2 relative flex-wrap",
          modal && "text-primary-white",
        )}
      >
        {/* avt */}

        {modal ? (
          <ModalMiniUserProfile
            user={item?.createdBy as User}
          ></ModalMiniUserProfile>
        ) : (
          <MiniUserProfile user={item?.createdBy}></MiniUserProfile>
        )}
        {/* name */}
        <div className="flex items-center gap-x-1">
          <Link href={`/${item?.createdBy._id}`} scroll={true}>
            <RealUsername
              username={String(item?.createdBy.name)}
              isReal={!!item?.createdBy.isReal}
            ></RealUsername>
          </Link>
        </div>
        {/* time */}

        {isShowTime && (
          <div className="flex items-center order-3">
            <Dot className="size-4" />

            <p className="text-xs md:text-sm text-second-gray">
              {getRelativeTime(String(item?.createdAt))}
            </p>
          </div>
        )}
        {!myUser?.followings.includes(item?.createdBy._id as string) &&
          item?.createdBy._id !== myUser?._id && (
            <button
              onClick={async () =>
                hanndleFollowUser(item?.createdBy._id as string)
              }
              className="text-sm font-semibold text-primary-blue hover:text-primary-blue-hover order-2 md:order-3"
            >
              Theo dõi
            </button>
          )}
      </div>
      {modal ? (
        <ModalReportBtn post={item}></ModalReportBtn>
      ) : (
        <PostReportModal item={item}></PostReportModal>
      )}
    </div>
  );
};

export default PostItemHeading;
