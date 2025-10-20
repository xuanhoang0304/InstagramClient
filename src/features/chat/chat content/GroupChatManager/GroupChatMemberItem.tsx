import { useMemo } from "react";

import ModalMiniUserProfile from "@/features/home/components/posts/miniUser/ModalMiniUserProfile";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

import { IGroup } from "../../type";
import GroupChatManagerActionBtns from "./GroupChatManagerActionBtns";

interface GroupChatMemberItemProps {
  member: User;
  group: IGroup;
  isOwner: boolean;

  onSetMembers: (members: User[] | ((prev: User[]) => User[])) => void;
}
const GroupChatMemberItem = ({
  member,
  group,
  isOwner,

  onSetMembers,
}: GroupChatMemberItemProps) => {
  const { myUser } = useMyStore();

  const isCreatedByMe = useMemo(() => {
    return group.createdBy._id === String(myUser?._id);
  }, [group.createdBy._id]);
  const isAdmin = group.groupAdmin.find((u) => u._id === String(myUser?._id));
  const isMemberAd = group.groupAdmin.find((u) => u._id === String(member._id));
  const deleteMemberAccess = !!isAdmin || !!isCreatedByMe;
  return (
    <li className="flex items-center relative last:border-none p-2 justify-between border-b border-bg-second-button-background    ">
      <div className="flex items-center gap-x-2">
        <ModalMiniUserProfile
          user={member}
          imageWrapperClass="size-10"
          imageSize={40}
          profileContentClass="left-0 top-15 min-w-[300px]"
        ></ModalMiniUserProfile>
        <div>
          <h3 className="line-clamp-1 font-semibold">
            {member._id === myUser?._id ? `${member.name} (tôi)` : member.name}
          </h3>
          <p className="text-xs text-second-gray">
            {isOwner
              ? "Trưởng nhóm"
              : isMemberAd
                ? "Quản trị viên"
                : "Thành viên"}
          </p>
        </div>
      </div>
      {String(myUser?._id) !== String(member._id) &&
        (!isAdmin || !isOwner) &&
        deleteMemberAccess && (
          <GroupChatManagerActionBtns
            isAdmin={!!isMemberAd}
            isOwner={isCreatedByMe}
            onSetMembers={onSetMembers}
            group={group}
            member={member}
          />
        )}
    </li>
  );
};

export default GroupChatMemberItem;
