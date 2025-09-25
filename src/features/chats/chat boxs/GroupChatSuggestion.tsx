import { User } from "@/types/types";

import GroupChatSuggestionItem from "./GroupChatSuggestionItem";

type GroupChatSuggestionProps = {
  list: User[] | [];
  totalSuggestion: number | undefined;
  selectedList: User[] | [];
  onSetSelectedList: (list: User[] | []) => void;
};
const GroupChatSuggestion = ({
  list,
  selectedList,
  onSetSelectedList,
}: GroupChatSuggestionProps) => {
  if (list.length === 0) {
    return (
      <p className="pl-2  text-second-gray text-sm font-semibold">
        Không tìm thấy tài khoản nào
      </p>
    );
  }
  return (
    <ul className=" flex flex-col gap-y-2">
      {list.map((user) => (
        <GroupChatSuggestionItem
          key={user._id}
          user={user}
          selectedList={selectedList}
          onSetSelectedList={onSetSelectedList}
        ></GroupChatSuggestionItem>
      ))}
    </ul>
  );
};

export default GroupChatSuggestion;
