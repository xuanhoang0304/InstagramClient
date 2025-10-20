import { AxiosError } from "axios";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { ChevronDown, Ellipsis } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import RealUsername from "@/components/layout/RealUsername";
import { apiClient } from "@/configs/axios";
import envConfig from "@/configs/envConfig";
import { IGroupResponse } from "@/features/chat/type";
import MiniUserDetails from "@/features/home/components/posts/miniUser/MiniUserDetails";
import { UnFollowModal } from "@/features/home/components/posts/UnFollowModal";
import {
  cn,
  handleFollowingUser,
  handleMutateWithKey,
  textWithLinks,
} from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

type UserInfoProps = {
  user: User | undefined;
  totalPost: number;
};
const UserInfo = ({ user, totalPost }: UserInfoProps) => {
  const { userId } = useParams();
  const { myUser, setMyUser } = useMyStore();
  const router = useRouter();

  const handlFollowOrUnFollow = async (id: string) => {
    const res = await handleFollowingUser(id);
    if (res?.code === 200) {
      handleMutateWithKey(`${envConfig.BACKEND_URL}/users/${id}`);
      setMyUser(res.data);
    }
  };
  const handleCreateGroupChat = async (partnerId: string) => {
    try {
      const response: IGroupResponse = await apiClient.fetchApi(`groups/`, {
        data: {
          members: [partnerId],
          isGroup: false,
        },
        method: "POST",
      });
      if (response.code === 201) {
        router.push(`/chats/${response.data._id}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message === "Group chat is existed") {
          router.push(`/chats/${error.response?.data.detail}`);
        }
      }
    }
  };
  const sanitizedHTML = DOMPurify.sanitize(textWithLinks(user?.bio || ""));

  const bioParsed = parse(sanitizedHTML);

  return (
    <div className={cn("flex-1 flex md:block flex-col md:gap-y-4")}>
      <div className="flex items-center gap-2 justify-between md:justify-start flex-wrap">
        <div className="hidden md:flex items-center gap-x-1">
          <RealUsername
            username={user?.name as string}
            isReal={!!user?.isReal}
            className="text-2xl"
          ></RealUsername>
          <button className="hidden md:block">
            <Ellipsis />
          </button>
        </div>
      </div>
      {/* Details */}
      <div className="hidden md:flex gap-x-8 items-center mt-4">
        <MiniUserDetails
          className="flex-col md:flex-row gap-x-2"
          desc="bài viết"
          quantity={totalPost}
        ></MiniUserDetails>
        <MiniUserDetails
          className="flex-col md:flex-row gap-x-2"
          desc="người theo dõi"
          quantity={user?.followers?.length || 0}
        ></MiniUserDetails>
        <MiniUserDetails
          className="flex-col md:flex-row gap-x-2"
          desc="đang theo dõi"
          quantity={user?.followings?.length || 0}
        ></MiniUserDetails>
      </div>
      {/* Bio */}
      {!!bioParsed.toString().length && (
        <p className="text-xs md:text-sm mt-4">{bioParsed}</p>
      )}
      {/* Button */}
      <div
        className={cn(
          "md:mt-4 flex gap-2 w-full md:w-auto flex-wrap justify-between items-center font-semibold text-sm",
          user?.bio && "mt-4",
        )}
      >
        {userId === myUser?._id ? (
          <>
            <Link
              href={`/account/edit`}
              className="bg-second-button-background text-center  whitespace-nowrap shrink-0 flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[12px] py-3"
            >
              Chỉnh sửa thông tin cá nhân
            </Link>
            <button className="bg-second-button-background whitespace-nowrap shrink-0 flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[12px] py-3">
              Xem kho lưu trữ
            </button>
          </>
        ) : myUser?.followings.includes(userId as string) ? (
          <>
            <UnFollowModal
              Trigger={
                <button className="flex items-center gap-x-1 min-w-[180px]  flex-1 justify-center bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[12px] py-3  shrink-0">
                  <p>Đang theo dõi</p>
                  <ChevronDown className="size-4" />
                </button>
              }
              user={user}
              onFollowFunc={handlFollowOrUnFollow}
            ></UnFollowModal>
            <button
              onClick={() => handleCreateGroupChat(user?._id || "")}
              className="bg-second-button-background  flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[12px] py-3 shrink-0"
            >
              Nhắn tin
            </button>
          </>
        ) : (
          <>
            <button
              onClick={async () => handlFollowOrUnFollow(user?._id || "")}
              className="bg-primary-blue md:flex-auto flex-1 hover:bg-second-blue text-primary-white px-4 py-3 rounded-[12px] transition-colors shrink-0"
            >
              Theo dõi
            </button>
            <button
              onClick={() => handleCreateGroupChat(user?._id || "")}
              className="bg-second-button-background md:flex-auto flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[12px] py-3 shrink-0"
            >
              Nhắn tin
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
