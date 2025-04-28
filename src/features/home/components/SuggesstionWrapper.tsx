"use client";
import SuggestionItem from "@/features/home/components/SuggestionItem";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/configs/axios";
import { tempArr } from "@/lib/utils";
import { getExloreUser, User } from "@/types/types";
import Link from "next/link";
import { useEffect, useState } from "react";

const SuggesstionWrapper = () => {
    const [list, setList] = useState<User[]>([]);

    const getSuggestionList = async () => {
        try {
            const data: getExloreUser = await apiClient.fetchApi(
                "http://localhost:5000/api/users/explore?limit=2"
            );

            setList(data.result.result);
        } catch (error) {
            console.log("error", error);
        }
    };
    useEffect(() => {
        getSuggestionList();
    }, []);
    return (
        <div className="mt-6">
            <div className="flex items-center justify-between font-semibold">
                <p className="text-second-gray text-sm">Gợi ý cho bạn</p>
                <Link href={"#"} className="text-xs ">
                    Xem tất cả
                </Link>
            </div>
            <ul className="flex flex-col gap-y-4 mt-4">
                {list.length
                    ? list.map((item: User) => (
                          <SuggestionItem
                              key={item._id}
                              item={item}
                          ></SuggestionItem>
                      ))
                    : tempArr.slice(5).map((item) => (
                          <li
                              key={item.id}
                              className=" flex justify-between items-center"
                          >
                              <div className=" flex items-center gap-x-2">
                                  <Skeleton className="size-11 rounded-full"></Skeleton>

                                  <div className="flex flex-col gap-y-1">
                                      <Skeleton className="h-[10px] w-20"></Skeleton>
                                      <Skeleton className="h-[10px] w-20"></Skeleton>
                                  </div>
                              </div>
                              <Skeleton className="w-10 h-2"></Skeleton>
                          </li>
                      ))}
            </ul>
        </div>
    );
};

export default SuggesstionWrapper;
