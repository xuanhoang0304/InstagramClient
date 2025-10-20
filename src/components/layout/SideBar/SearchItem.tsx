import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, MouseEvent } from "react";
import { useLocalStorage } from "usehooks-ts";

import { User } from "@/types/types";

import RealUsername from "../RealUsername";

type Props = {
  item: User;
  type?: "search-user" | "history-list";
  onAddToHistoryList?: (item: User) => void;
};

const SearchItem = ({
  item,
  type = "history-list",
  onAddToHistoryList,
}: Props) => {
  const [oldList, setValue] = useLocalStorage<User[]>("historyList", []);

  const handleDeleteHistoryItem = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const newList = (oldList as User[]).filter((u) => u._id !== item._id);
    setValue(newList);
  };
  return (
    <li
      onClick={() => onAddToHistoryList?.(item)}
      key={item._id}
      className="py-2 px-4 hover:bg-primary-gray"
    >
      <Link href={`/${item._id}`} className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <figure className="size-11 rounded-full">
            <Image
              src={item.avatar || "/images/default.jpg"}
              alt="avatar"
              width={44}
              height={44}
              className="rounded-full size-full object-cover"
            ></Image>
          </figure>
          <RealUsername
            username={item.name}
            isReal={item.isReal}
          ></RealUsername>
        </div>
        {type === "history-list" && (
          <button onClick={(e) => handleDeleteHistoryItem(e)} className="p-1">
            <X className="size-5 text-second-gray" />
          </button>
        )}
      </Link>
    </li>
  );
};

export default memo(SearchItem);
