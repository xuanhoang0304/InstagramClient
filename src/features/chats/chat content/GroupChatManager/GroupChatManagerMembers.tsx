import sortBy from "lodash/sortBy";
import { MoveLeft } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { normalizeString } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

import AddGroupsChatBtn from "../../chat boxs/AddGroupsChatBtn";
import { IGroup } from "../../type";
import GroupChatListMember from "./GroupChatListMember";

interface GroupChatManagerMembersProps {
  group: IGroup;
  onSetStep: (step: string) => void;
}

const GroupChatManagerMembers = ({
  group,
  onSetStep,
}: GroupChatManagerMembersProps) => {
  const [searchText, setSearchText] = useState("");
  const [members, setMembers] = useState<User[]>(group.members);
  const { myUser } = useMyStore();
  const debounceSearchText = useDebounce(searchText, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const memberIds = useMemo(() => {
    return group.members.map((u) => `"${u._id}"`);
  }, [group.members.length]);

  const handleSetMembers = (members: User[] | ((prev: User[]) => User[])) => {
    setMembers(members);
  };
  useEffect(() => {
    const list = group.members.filter((u) =>
      u.name_normailized.includes(normalizeString(debounceSearchText)),
    );
    setMembers(list);
  }, [debounceSearchText]);
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <button onClick={() => onSetStep("")}>
          <MoveLeft />
        </button>
        <span>Danh sách thành viên</span>

        <AddGroupsChatBtn
          trigger={
            <button className="px-3 py-1 bg-primary-blue rounded font-semibold text-xs">
              + Thêm
            </button>
          }
          action="add-member"
          members={memberIds}
          group={group}
          side="bottom"
          onSetMembers={handleSetMembers}
        ></AddGroupsChatBtn>
      </div>
      <div className="mt-6">
        <Input
          value={searchText}
          placeholder="Tìm thành viên.."
          onChange={handleChange}
        ></Input>
      </div>
      {members.length ? (
        <GroupChatListMember
          members={sortBy(members, (u) =>
            u._id === String(myUser?._id) ? "0" : "1",
          )}
          group={group}
          onSetMembers={handleSetMembers}
        ></GroupChatListMember>
      ) : (
        <p className="text-red-500 text-sm bg-pink-200 p-2 rounded mt-3 font-semibold">
          Không tìm thấy thành viên này !
        </p>
      )}
    </div>
  );
};

export default GroupChatManagerMembers;
