"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import Loading from "@/components/layout/loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyStore } from "@/store/zustand";

import AccountEditAvtDialog from "./AccountEditAvtDialog";

const AccountEditInfoAvt = () => {
  const { myUser } = useMyStore();
  const [avatar, setAvatar] = useState(myUser?.avatar || "/images/default.jpg");
  const [isLoading, setLoading] = useState(false);
  const handleSetAvt = useCallback(
    (avtUrl: string) => {
      setAvatar(avtUrl);
    },
    [avatar],
  );
  const handleSetLoading = useCallback((loading: boolean) => {
    setLoading(loading);
  }, []);
  useEffect(() => {
    setAvatar(myUser?.avatar || "/images/default.jpg");
  }, [myUser?.avatar]);
  if (!myUser?._id) {
    return (
      <Skeleton className="mt-8 p-4 rounded-3xl h-[88px] w-full !bg-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Skeleton className="size-[56px] rounded-full shrink-0"></Skeleton>
          <Skeleton className="w-[130px] h-6"></Skeleton>
        </div>
        <Skeleton className="h-7 w-[81.54px] rounded-lg"></Skeleton>
      </Skeleton>
    );
  }
  return (
    <div className="mt-8 p-4 rounded-3xl bg-primary-gray flex items-center justify-between">
      <div className="flex items-center gap-x-4">
        <AccountEditAvtDialog
          trigger={
            <figure className="size-[56px] rounded-full shrink-0 cursor-pointer relative">
              <Image
                src={avatar}
                alt="user-avt"
                width={56}
                height={56}
                className="rounded-full object-cover size-full"
              ></Image>
              {isLoading && (
                <Loading
                  className="absolute inset-0 rounded-full bg-black/30"
                  text=" "
                  spinneClassname="size-8 border-4"
                ></Loading>
              )}
            </figure>
          }
          onSetAvt={handleSetAvt}
          onSetLoading={handleSetLoading}
        ></AccountEditAvtDialog>
        <h3 className="font-bold line-clamp-1">{myUser?.name}</h3>
      </div>
      <AccountEditAvtDialog
        trigger={
          <button className="hover:bg-primary-blue bg-second-blue transition-colors px-4 py-1 rounded-lg text-sm font-semibold">
            Đổi ảnh
          </button>
        }
        onSetAvt={handleSetAvt}
        onSetLoading={handleSetLoading}
      ></AccountEditAvtDialog>
    </div>
  );
};

export default AccountEditInfoAvt;
