"use client";
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { cn, tempArr } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { HttpResponse } from '@/types/types';

import { IGroup } from '../type';

interface GetIGroupResponse extends HttpResponse {
    result: {
        result: IGroup[];
        totalResult: number;
    };
}
const ChatsList = () => {
    const { groupId } = useParams();
    const { myUser } = useMyStore();
    const router = useRouter();
    const [list, setList] = useState<IGroup[] | []>([]);
    const { data } = useApi<GetIGroupResponse>(
        myUser?._id
            ? `${envConfig.BACKEND_URL}/api/groups/?filter={"userId":"${myUser?._id}"}&sort=updatedAt&order=DESC`
            : ""
    );

    useEffect(() => {
        if (data) {
            setList(data.result.result);
        }
    }, [data]);
    if (!myUser?._id) {
        return (
            <ul className="flex flex-col w-full gap-y-0.5 mt-2  ">
                {tempArr.slice(0, 10).map((item) => (
                    <li
                        key={item.id}
                        className="flex items-center gap-x-3 px-6 py-2"
                    >
                        <Skeleton className="size-[56px] rounded-full shrink-0"></Skeleton>
                        <div className="w-full">
                            <Skeleton className="w-full h-4"></Skeleton>
                            <Skeleton className="w-full h-4 mt-2"></Skeleton>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }
    return (
        <ul className="flex flex-col gap-y-0.5 mt-2 h-[calc(100vh-200px)] overflow-y-auto hidden-scrollbar transition-opacity ">
            {list.map((item) => {
                const partner = !item.isGroup
                    ? item.members.find((user) => user._id !== myUser?._id)
                    : null;
                return (
                    <li
                        key={item._id}
                        className={cn(
                            "flex items-center gap-x-3 px-6 py-2 cursor-pointer hover:bg-second-button-background",
                            item._id === groupId &&
                                "bg-second-button-background"
                        )}
                        onClick={() => {
                            router.push(`/chats/${item._id}`);
                        }}
                    >
                        <figure className="size-[56px] rounded-full shrink-0">
                            <Image
                                src={
                                    item.groupAvt ||
                                    (!item.isGroup && partner?.avatar) ||
                                    "/images/default.jpg"
                                }
                                alt="user avt"
                                width={100}
                                height={100}
                                className="size-full rounded-full object-cover"
                            ></Image>
                        </figure>
                        <div>
                            <h3
                                className={cn(
                                    "line-clamp-1 ",
                                    item.isGroup == false &&
                                        "flex items-center gap-x-1"
                                )}
                            >
                                {item.groupName || partner?.name}
                                {partner?.isReal && (
                                    <svg
                                        aria-label="Đã xác minh"
                                        className="x1lliihq x1n2onr6"
                                        fill="rgb(0, 149, 246)"
                                        height="12"
                                        role="img"
                                        viewBox="0 0 40 40"
                                        width="12"
                                    >
                                        <title>Đã xác minh</title>
                                        <path
                                            d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                                            fillRule="evenodd"
                                        ></path>
                                    </svg>
                                )}
                            </h3>
                            <p className="mt-0.5 text-second-gray text-sm">
                                Hoạt động 1 giờ trước
                            </p>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default ChatsList;
