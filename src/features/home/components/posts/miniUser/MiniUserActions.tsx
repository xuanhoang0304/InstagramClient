import { AxiosError } from "axios";
import { MessageCircleMore, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { apiClient } from "@/configs/axios";
import { IGroupResponse } from "@/features/chats/type";
import { UnFollowModal } from "@/features/home/components/posts/UnFollowModal";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

type MiniUserActionsProps = {
  onFollowOrUnFollow: (id: string) => Promise<void>;
  user: User | undefined;
  modal?: boolean;
};
const MiniUserActions = ({
  user,
  modal,
  onFollowOrUnFollow,
}: MiniUserActionsProps) => {
  const { myUser } = useMyStore();

  const router = useRouter();
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
  return (
    <>
      {myUser?.followings.includes(String(user?._id)) ? (
        <div className="flex items-center gap-x-2 mt-4 justify-center px-4">
          <button
            onClick={() => handleCreateGroupChat(user?._id as string)}
            className="bg-second-blue flex-1 px-4 md:px-9 py-[6px] whitespace-nowrap rounded-[8px] flex items-center justify-center gap-x-2 hover:opacity-75 transition-colors"
          >
            <MessageCircleMore className="size-5" />
            <p className="text-sm font-semibold">Nhắn tin</p>
          </button>
          <UnFollowModal
            Trigger={
              <button className="bg-[#262626] flex-1 whitespace-nowrap py-1.5 px-[39.9px] rounded-[8px] text-sm font-semibold hover:opacity-75 transition-colors">
                Đang theo dõi
              </button>
            }
            user={user}
            onFollowFunc={onFollowOrUnFollow}
            modal={modal}
          ></UnFollowModal>
        </div>
      ) : (
        <button
          onClick={() => onFollowOrUnFollow(user?._id as string)}
          className={cn(
            "bg-second-blue hover:opacity-75 transition-colors whitespace-nowrap mt-4 py-[7px] flex items-center justify-center gap-x-2 w-[calc(100%-32px)] mx-auto rounded-[8px]",
            myUser?._id === user?._id && "hidden",
          )}
        >
          <UserPlus className="size-5" />
          <p className="text-sm font-semibold">Theo dõi</p>
        </button>
      )}
    </>
  );
};

export default MiniUserActions;
