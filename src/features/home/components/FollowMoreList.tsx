import { uniqBy } from "lodash";
import { useCallback, useEffect, useState } from "react";

import Loading from "@/components/layout/loading";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { getExloreUser, User } from "@/types/types";

import FollowMoreInput from "./FollowMoreInput";
import FollowMoreItem from "./FollowMoreItem";

interface Props {
  seletedUsers: string[];
  onSetSelectedUsers: (users: string[]) => void;
}
const FollowMoreList = ({ seletedUsers, onSetSelectedUsers }: Props) => {
  const [followers, setFollowers] = useState<User[]>([]);
  const [mockUser, setMockUser] = useState<User[]>([]);
  const { data, isLoading } = useApi<getExloreUser>(
    `${envConfig.BACKEND_URL}/api/users/explore?limit=20`,
  );
  const handleSetFollowers = useCallback((users: User[]) => {
    setFollowers(users);
  }, []);

  useEffect(() => {
    if (data) {
      setFollowers((prev) => uniqBy([...prev, ...data.result.result], "_id"));
      setMockUser((prev) => uniqBy([...prev, ...data.result.result], "_id"));
    }
  }, [data]);

  return (
    <>
      <FollowMoreInput
        mockUser={mockUser}
        onSetFollowers={handleSetFollowers}
        onSetSelectedUsers={onSetSelectedUsers}
      ></FollowMoreInput>
      <ul className="flex flex-col w-full h-[70%] max-h-[calc(100vh-100px)] min-h-[200px] md:min-h-[300px] overflow-y-auto hidden-scrollbar relative">
        {isLoading && (
          <Loading
            className="absolute inset-0"
            text="Đang tải danh sách..."
          ></Loading>
        )}
        {followers.length ? (
          followers.map((item) => (
            <FollowMoreItem
              key={item._id}
              item={item}
              seletedUsers={seletedUsers}
              onSetSelectedUsers={onSetSelectedUsers}
            ></FollowMoreItem>
          ))
        ) : (
          <p className="text-red-500 text-center">
            Không tìm thấy người dùng phù hợp
          </p>
        )}
      </ul>
    </>
  );
};

export default FollowMoreList;
