"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import Loading from "@/components/layout/loading";
import { Button } from "@/components/ui/button";
import {
  handleError,
  handleFollowingUser,
  handleMutateWithKey,
} from "@/lib/utils";

import MobileHeaderListPost from "../../../components/layout/MobileHeaderListPost";
import FollowMoreList from "./FollowMoreList";

const FollowMoreUser = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setLoading] = useState(false);
  const handleSetSelectedUsers = (users: string[] | []) => {
    setSelectedUsers(users);
  };
  const handleFollowUsers = async (users: string[]) => {
    try {
      setLoading(true);
      const res = await Promise.all(users.map((u) => handleFollowingUser(u)));
      if (res.length === users.length) {
        toast.success("Đã theo dõi những người khác");
        handleMutateWithKey("/auth/@me");
        handleMutateWithKey(`/posts`);
        handleMutateWithKey(`/users`);
      }
    } catch (error) {
      handleError("handleFollowUsers", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex items-center  flex-col gap-y-6 my-10 max-w-full md:max-w-[80%] mx-auto">
      {isLoading &&
        createPortal(
          <Loading
            className=" inset-0 bg-black/80"
            text="Đang theo dõi người dùng..."
          ></Loading>,
          document.body,
        )}
      <MobileHeaderListPost></MobileHeaderListPost>
      <h1 className="text-3xl font-bold text-center ">
        Xem thông tin mới tại đây khi bạn theo dõi tài khoản khác
      </h1>

      <FollowMoreList
        seletedUsers={selectedUsers}
        onSetSelectedUsers={handleSetSelectedUsers}
      ></FollowMoreList>
      <div className="sticky md:static bottom-[60px] z-10 bg-black w-full py-2 mx-auto flex justify-center">
        <Button
          onClick={() => handleFollowUsers(selectedUsers)}
          className=" min-w-[150px] mx-auto"
          disabled={!selectedUsers.length || isLoading}
        >
          Theo dõi
        </Button>
      </div>
    </section>
  );
};

export default FollowMoreUser;
