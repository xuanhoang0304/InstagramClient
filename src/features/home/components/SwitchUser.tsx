"use client";

import Image from 'next/image';
import Link from 'next/link';

import { Skeleton } from '@/components/ui/skeleton';
import { useMyStore } from '@/store/zustand';

const SwitchUser = () => {
    const { myUser } = useMyStore();
    return (
        <div className=" flex justify-between items-center">
            <div className=" flex items-center gap-x-2">
                {myUser ? (
                    <Link href={`/${myUser?._id}`}>
                        <figure className="size-11 rounded-full">
                            <Image
                                src={myUser?.avatar || "/images/default.jpg"}
                                alt="Profile-avt"
                                width={44}
                                height={44}
                                className="rounded-full size-full object-cover"
                            ></Image>
                        </figure>
                    </Link>
                ) : (
                    <Skeleton className="size-11 rounded-full "></Skeleton>
                )}
                <div className="flex flex-col">
                    {myUser ? (
                        <Link
                            href={`/${myUser?._id}`}
                            className=" text-sm leading-[18px] font-semibold max-w-[150px] line-clamp-1"
                        >
                            {myUser?.name}
                        </Link>
                    ) : (
                        <Skeleton className="h-[10px] rounded-full w-20"></Skeleton>
                    )}
                    {myUser ? (
                        <p className="text-second-gray text-sm leading-[18px]">
                            {myUser?.bio ? myUser.bio : ""}
                        </p>
                    ) : (
                        <Skeleton className="h-[10px] rounded-full w-20 mt-2"></Skeleton>
                    )}
                </div>
            </div>
            {myUser ? (
                <button className="text-primary-blue font-semibold text-xs hover:text-primary-blue-hover">
                    Chuyển
                </button>
            ) : (
                <Skeleton className="w-10 h-2"></Skeleton>
            )}
        </div>
    );
};

export default SwitchUser;
