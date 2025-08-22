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
            ? `${envConfig.BACKEND_URL}/api/groups/?filter={"userId":"${myUser?._id}"}`
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
                            <h3 className="line-clamp-1">
                                {item.groupName ||
                                    (!item.isGroup &&
                                    item.createdBy._id === myUser?._id
                                        ? item.members[0].name
                                        : item.members[1].name)}
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
