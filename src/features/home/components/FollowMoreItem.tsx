import { Check } from "lucide-react";
import Link from "next/link";

import RealUsername from "@/components/layout/RealUsername";
import { cn } from "@/lib/utils";
import { User } from "@/types/types";

import ModalMiniUserProfile from "./posts/miniUser/ModalMiniUserProfile";

type Props = {
  item: User;
  seletedUsers: string[];
  onSetSelectedUsers: (users: string[]) => void;
};

const FollowMoreItem = ({ item, seletedUsers, onSetSelectedUsers }: Props) => {
  const isChecked = !!seletedUsers.includes(item._id);
  const handleSetSelectedUsers = (users: string[]) => {
    onSetSelectedUsers(
      isChecked
        ? [...users].filter((user) => user !== item._id)
        : [...users, item._id],
    );
  };
  return (
    <li
      className={cn(
        "flex items-center justify-between  w-full py-4 px-6 bg-transparent relative transition-colors",
        isChecked && "bg-second-button-background",
      )}
    >
      <div className="flex gap-x-4">
        <ModalMiniUserProfile
          user={item}
          imageSize={50}
          imageWrapperClass="size-[50px]"
        ></ModalMiniUserProfile>
        <div className="font-semibold max-w-3/4">
          <Link href={`/${item._id}`} className="flex items-center gap-x-2">
            <RealUsername
              username={item.name}
              isReal={item?.isReal}
            ></RealUsername>
          </Link>
          <p className="text-xs text-second-gray">Gợi ý cho bạn</p>
        </div>
      </div>

      <button
        className={cn(
          "p-1 rounded-full border border-second-gray shrink-0",
          isChecked && "bg-second-blue border-transparent",
        )}
        onClick={() => handleSetSelectedUsers(seletedUsers)}
      >
        <Check
          className={cn(
            "size-4 font-bold opacity-0 transition-opacity",
            isChecked && "opacity-100",
          )}
        />
      </button>
    </li>
  );
};

export default FollowMoreItem;
