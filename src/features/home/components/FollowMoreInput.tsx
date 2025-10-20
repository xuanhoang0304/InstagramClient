import { memo, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import envConfig from "@/configs/envConfig";
import { SuggestionUserResponse } from "@/features/chat/chat boxs/AddGroupsChatBtn";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

interface Props {
  mockUser: User[];
  onSetFollowers: (users: User[]) => void;
  onSetSelectedUsers: (users: string[]) => void;
}
const FollowMoreInput = ({
  mockUser,
  onSetFollowers,
  onSetSelectedUsers,
}: Props) => {
  const [searchTxt, setSearchTxt] = useState("");
  const debouncedSearchTxt = useDebounce(searchTxt, 200);
  const { myUser } = useMyStore();
  const excludes = [
    ...(myUser?.followings as string[]).map((u) => `"${u}"`),
    `"${myUser?._id}"`,
  ];
  const { data } = useApi<SuggestionUserResponse>(
    debouncedSearchTxt &&
      `${envConfig.BACKEND_URL}/api/users/?filters={"keyword": "${debouncedSearchTxt}","excludes": [${excludes}]}&page=1&limit=10`,
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTxt(e.target.value);
  };
  useEffect(() => {
    if (data) {
      onSetFollowers(data.result.users);
      onSetSelectedUsers([]);
    }
  }, [data]);
  useEffect(() => {
    if (!searchTxt) {
      onSetFollowers(mockUser);
      onSetSelectedUsers([]);
    }
  }, [searchTxt]);
  return (
    <div className="px-4 md:px-0 w-full">
      <Input
        name="search-more-user"
        type="text"
        placeholder="Tìm kiếm nguời dùng khác.."
        className="rounded-full"
        value={searchTxt}
        autoComplete="off"
        onChange={handleChange}
      ></Input>
    </div>
  );
};

export default memo(FollowMoreInput);
