import { Check } from "lucide-react";
import Image from "next/image";

import RealUsername from "@/components/layout/RealUsername";
import { cn } from "@/lib/utils";
import { User } from "@/types/types";

type GroupChatSuggestionItemProps = {
  user: User;
  selectedList: User[] | [];
  onSetSelectedList: (list: User[] | []) => void;
};
const GroupChatSuggestionItem = ({
  user,
  selectedList,
  onSetSelectedList,
}: GroupChatSuggestionItemProps) => {
  const handleCick = () => {
    const newList = selectedList.find((item) => item._id === user._id)
      ? selectedList.filter((item) => item._id !== user._id)
      : [...selectedList, user];
    onSetSelectedList(newList);
  };
  return (
    <li
      onClick={handleCick}
      className={cn(
        "flex justify-between items-center hover:bg-second-button-background cursor-pointer px-3 py-2",
        selectedList.find((item) => item._id === user._id) &&
          "bg-second-button-background",
      )}
    >
      <div className="flex items-center gap-x-3">
        <figure className="size-11 rounded-full shrink-0">
          <Image
            src={user.avatar || "/images/default.jpg"}
            alt="user avt"
            width={100}
            height={100}
            className="size-full object-cover rounded-full"
          ></Image>
        </figure>

        {/* <h3 className="text-sm line-clamp-1">{user.name}</h3> */}
        <RealUsername username={user.name} isReal={user.isReal}></RealUsername>
      </div>
      <button
        className={cn(
          "size-6 rounded-full shrink-0 border border-primary-white text-transparent flex items-center justify-center",
          selectedList.find((item) => item._id === user._id) &&
            "bg-primary-white text-primary-gray",
        )}
      >
        <Check className="size-4  font-bold" />
      </button>
    </li>
  );
};

export default GroupChatSuggestionItem;
