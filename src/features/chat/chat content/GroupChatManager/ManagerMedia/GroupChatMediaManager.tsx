import { MoveLeft } from "lucide-react";

import { IGroup } from "@/features/chat/type";

import GroupChatMediaList from "./GroupChatMediaList";

type Props = {
  onSetStep: (step: string) => void;
  group: IGroup;
};
const GroupChatMediaManager = ({ onSetStep, group }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="GroupChatMediaManager-header p-4 flex items-center gap-x-3 sticky top-0 bg-primary-gray border-b ">
        <button onClick={() => onSetStep("")}>
          <MoveLeft />
        </button>
        <p className="font-semibold">Ảnh, file, link</p>
      </div>
      <GroupChatMediaList group={group}></GroupChatMediaList>
    </div>
  );
};

export default GroupChatMediaManager;
