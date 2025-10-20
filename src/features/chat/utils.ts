import { toast } from "sonner";
import { mutate } from "swr";

import { apiClient } from "@/configs/axios";
import envConfig from "@/configs/envConfig";
import { handleError } from "@/lib/utils";
import { HttpResponse, User } from "@/types/types";

import { IGroup, IMessageFE } from "./type";

export const getTimeDifference = (time1: string, time2: string): number => {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  return Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60));
};
export const handleGroupMessages = (messages: IMessageFE[]): IMessageFE[][] => {
  if (!messages) return [];
  const groups: IMessageFE[][] = [];
  let currentGroup: IMessageFE[] = [];

  messages.forEach((message, index) => {
    if (index === 0) {
      currentGroup.push(message);
    } else {
      const prevMessage = messages[index - 1];
      const isSameSender = message.sender._id === prevMessage.sender._id;
      const timeDiff = getTimeDifference(
        String(message.createdAt),
        String(prevMessage.createdAt),
      );

      if (isSameSender && timeDiff <= envConfig.MINUTE_GROUP_MESSAGE) {
        currentGroup.push(message);
      } else {
        groups.push(currentGroup);
        currentGroup = [message];
      }
    }

    if (index === messages.length - 1) {
      groups.push(currentGroup);
    }
  });

  return groups;
};

export function scrollToMessage(messageId: string) {
  const element = document.getElementById(messageId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    return true;
  }
  return false;
}
export const handleDeleteMemberInGroupChat = async (
  data: {
    members: string[];
    action: "leave-group" | "delete-member";
  },
  groupId: string,
  memberId: string,
  onSetMembers?: (members: User[] | ((prev: User[]) => User[])) => void,
) => {
  try {
    const res: HttpResponse = await apiClient.fetchApi(
      `/groups/${groupId}/delete-members`,
      {
        data,
        method: "PUT",
      },
    );

    if (res.code === 200) {
      toast.success(
        data.action === "delete-member"
          ? "Thành viên đã bị xóa khỏi nhóm"
          : "Bạn đã rời nhóm",
      );
      onSetMembers?.((prev: User[]) => prev.filter((u) => u._id !== memberId));
      mutate(
        `${envConfig.BACKEND_URL}/api/groups/${groupId}`,
        (prev: (HttpResponse & { result: IGroup }) | undefined) => {
          if (!prev) return prev;
          return {
            ...prev,
            result: {
              ...prev.result,
              members: prev.result.members.filter((u) => u._id !== memberId),
            },
          };
        },
        false,
      );
    }
  } catch (e) {
    handleError("handleDeleteMember", e);
  }
};
