"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import SuggestionItem from "@/features/home/components/SuggestionItem";
import { useApi } from "@/hooks/useApi";
import { tempArr } from "@/lib/utils";
import { getExloreUser, User } from "@/types/types";

const SuggesstionWrapper = () => {
  const [list, setList] = useState<User[]>([]);
  const { data, isLoading } = useApi<getExloreUser>(
    `${envConfig.BACKEND_URL}/api/users/explore?limit=2`,
  );

  useEffect(() => {
    if (data) {
      setList(data.result.result);
    }
  }, [data]);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between font-semibold">
        <p className="text-second-gray text-sm">Gợi ý cho bạn</p>
        <Link href={"#"} className="text-xs ">
          Xem tất cả
        </Link>
      </div>
      {isLoading && (
        <ul className="flex flex-col gap-y-4 mt-4">
          {tempArr.slice(0, 4).map((item) => (
            <li key={item.id} className=" flex justify-between items-center">
              <div className=" flex items-center gap-x-2">
                <Skeleton className="size-8 rounded-full"></Skeleton>

                <div className="flex flex-col gap-y-1">
                  <Skeleton className="h-[10px] w-20"></Skeleton>
                  <Skeleton className="h-[10px] w-20"></Skeleton>
                </div>
              </div>
              <Skeleton className="w-10 h-2"></Skeleton>
            </li>
          ))}
        </ul>
      )}
      {list.length > 0 && !isLoading && (
        <ul className="flex flex-col gap-y-4 mt-4">
          {list.map((item: User) => (
            <SuggestionItem key={item._id} user={item}></SuggestionItem>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggesstionWrapper;
