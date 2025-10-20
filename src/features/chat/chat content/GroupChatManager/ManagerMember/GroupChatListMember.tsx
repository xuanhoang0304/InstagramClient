import { User } from "@/types/types";

import { IGroup } from "../../../type";
import GroupChatMemberItem from "./GroupChatMemberItem";

interface GroupChatListMemberProps {
  members: User[];
  group: IGroup;
  onSetMembers: (members: User[] | ((prev: User[]) => User[])) => void;
}
const GroupChatListMember = ({
  members,
  group,
  onSetMembers,
}: GroupChatListMemberProps) => {
  return (
    <ul className="mt-6 overflow-y-auto h-full">
      {members.map((member) => {
        const isOwner = group.createdBy._id === member._id;

        return (
          <GroupChatMemberItem
            key={member._id}
            member={member}
            group={group}
            isOwner={isOwner}
            onSetMembers={onSetMembers}
          ></GroupChatMemberItem>
        );
      })}
    </ul>
  );
};

export default GroupChatListMember;
