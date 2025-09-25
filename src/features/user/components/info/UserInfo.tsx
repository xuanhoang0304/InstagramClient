import { AxiosError } from "axios";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { ChevronDown, Ellipsis } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { apiClient } from "@/configs/axios";
import envConfig from "@/configs/envConfig";
import { IGroupResponse } from "@/features/chats/type";
import MiniUserDetails from "@/features/home/components/posts/miniUser/MiniUserDetails";
import { UnFollowModal } from "@/features/home/components/posts/UnFollowModal";
import {
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
    <div className="flex-1 flex md:block flex-col-reverse gap-y-4">
      <div className="flex items-center gap-2 justify-between md:justify-start flex-wrap">
        <div className="hidden md:flex items-center gap-x-1">
          <h1 className="text-xs md:text-xl max-w-[170px] line-clamp-1">
            {user?.name}
          </h1>
          {user?.isReal && (
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
        <div className="flex gap-2 w-full md:w-auto flex-wrap justify-between items-center font-semibold text-sm">
          {userId === myUser?._id ? (
            <>
              <button className="bg-second-button-background whitespace-nowrap md:flex-auto flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                Chỉnh sửa trang cá nhân
              </button>
              <button className="bg-second-button-background md:flex-auto flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                Xem kho lưu trữ
              </button>
            </>
          ) : myUser?.followings.includes(userId as string) ? (
            <>
              <UnFollowModal
                Trigger={
                  <button className="flex items-center gap-x-1 md:flex-auto flex-1 justify-center bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                    <p>Đang theo dõi</p>
                    <ChevronDown className="size-4" />
                  </button>
                }
                user={user}
                onFollowFunc={handlFollowOrUnFollow}
              ></UnFollowModal>
              <button
                onClick={() => handleCreateGroupChat(user?._id || "")}
                className="bg-second-button-background md:flex-auto flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]"
              >
                Nhắn tin
              </button>
            </>
          ) : (
            <>
              <button
                onClick={async () => handlFollowOrUnFollow(user?._id || "")}
                className="bg-primary-blue md:flex-auto flex-1 hover:bg-second-blue text-primary-white px-4 py-[6px] rounded-[8px] transition-colors"
              >
                Theo dõi
              </button>
              <button
                onClick={() => handleCreateGroupChat(user?._id || "")}
                className="bg-second-button-background md:flex-auto flex-1 hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]"
              >
                Nhắn tin
              </button>
            </>
          )}
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
        <p className="text-xs md:text-base">{bioParsed}</p>
      )}
    </div>
  );
};

export default UserInfo;
