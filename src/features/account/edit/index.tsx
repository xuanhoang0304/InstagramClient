"use client";
import dynamic from "next/dynamic";

import { Skeleton } from "@/components/ui/skeleton";

import AccountEditInfoAvt from "./AccountEditInfoAvt";

const AccountEditInfoForm = dynamic(() => import("./AccountEditInfoForm"), {
  ssr: false,
  loading: () => (
    <Skeleton className="mt-8 h-[392px] w-full !bg-gray-800/50 flex items-center justify-center">
      Loading...
    </Skeleton>
  ),
});
const AccountEditPage = () => {
  return (
    <div className="max-w-[calc(100%-20px)] md:max-w-[70%] xl:max-w-[50%] mx-auto w-full py-5 md:py-10">
      <h3 className="text-xl text-center font-bold">
        Chỉnh sửa thông tin cá nhân
      </h3>
      <AccountEditInfoAvt></AccountEditInfoAvt>
      <AccountEditInfoForm></AccountEditInfoForm>
    </div>
  );
};

export default AccountEditPage;
