"use client";

import { ArrowLeft, Bell, ChevronDown, EllipsisVertical, Lock, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { useEffect } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import envConfig from '@/configs/envConfig';
import MiniUserDetails from '@/features/home/components/posts/miniUser/MiniUserDetails';
import { SwitchUserContent } from '@/features/home/components/SwitchUserContent';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { getPostsByCreated, HttpResponse, User } from '@/types/types';

const UserInfo = dynamic(() => import("./UserInfo"), {
    loading: () => (
        <Skeleton className="flex-1 w-full min-h-[150px] shrink-0"></Skeleton>
    ),
    ssr: false,
});
const UserHeading = () => {
    const { userId } = useParams();
    const { myUser } = useMyStore();
    const { data, isLoading } = useApi<{ result: User } & HttpResponse>(
        `${envConfig.BACKEND_URL}/api/users/${userId}`
    );
    const { data: userPost } = useApi<getPostsByCreated>(
        data?.result?._id
            ? `${envConfig.BACKEND_URL}/api/posts/?filters={"createdBy": ["${data?.result?._id}"]}`
            : null
    );

    const isMyPage = userId === myUser?._id;
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    if (isLoading) {
        return (
            <>
                <Skeleton className="md:hidden fixed top-0 h-9 mt-3 flex items-center justify-between left-0 right-0 bg-black mx-3 py-2 z-50"></Skeleton>
                <div className="flex flex-col md:flex-row gap-x-10 gap-y-4 md:max-w-[935px] w-full mx-auto">
                    <div className="md:w-[150px] w-full shrink-0 flex  justify-between gap-x-2">
                        <Skeleton className="md:size-[150px] size-[60px] rounded-full shrink-0"></Skeleton>

                        <Skeleton className="md:hidden w-full h-[60px] "></Skeleton>
                    </div>
                    <Skeleton className="flex-1 w-full min-h-[150px] shrink-0"></Skeleton>
                </div>
            </>
        );
    }

    if (!data?.result) {
        notFound();
    }

    return (
        <>
            <div className="md:hidden fixed w-full flex items-center justify-between top-0 left-0 right-0 bg-black px-3 py-2 z-50">
                {!isMyPage ? (
                    <>
                        <div className="flex items-center gap-x-4">
                            <button
                                onClick={() => {
                                    window.history.back();
                                }}
                                className={cn(
                                    "px-3 py-1 flex items-center justify-center"
                                )}
                            >
                                <ArrowLeft />
                            </button>
                            <h3 className="font-bold">{data.result.name}</h3>
                        </div>
                        <div className="flex items-center gap-x-4">
                            <button className="px-3 py-1">
                                <Bell />
                            </button>
                            <button className="px-3 py-1">
                                <EllipsisVertical />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <SwitchUserContent
                            trigger={
                                <button className=" font-semibold flex items-center gap-x-2 hover:text-primary-blue-hover">
                                    <Lock className="size-4" />
                                    <h3 className=" font-bold">
                                        {data.result.name}
                                    </h3>
                                    <ChevronDown className="size-4" />
                                </button>
                            }
                        ></SwitchUserContent>
                        <button className="p-2">
                            <Menu />
                        </button>
                    </>
                )}
            </div>
            <div className="flex flex-col md:flex-row gap-x-10 gap-y-2 md:max-w-[935px] w-full mx-auto ">
                {/* avt */}
                <div className=" md:size-[150px]  shrink-0 flex  justify-between w-full">
                    <div>
                        <figure className="size-[60px] md:size-[150px] rounded-full ">
                            <Image
                                src={
                                    data?.result?.avatar ||
                                    "/images/default.jpg"
                                }
                                alt="user-avt"
                                width={300}
                                height={300}
                                className="size-full object-cover rounded-full"
                            ></Image>
                        </figure>
                    </div>
                    <div className="md:hidden flex  gap-x-4">
                        <MiniUserDetails
                            className="flex-col md:flex-row gap-x-2"
                            desc="bài viết"
                            quantity={userPost?.total || 0}
                        ></MiniUserDetails>
                        <MiniUserDetails
                            className="flex-col md:flex-row gap-x-2"
                            desc="người theo dõi"
                            quantity={data.result?.followers?.length || 0}
                        ></MiniUserDetails>
                        <MiniUserDetails
                            className="flex-col md:flex-row gap-x-2"
                            desc="đang theo dõi"
                            quantity={data.result?.followings?.length || 0}
                        ></MiniUserDetails>
                    </div>
                </div>
                {/* Info */}
                <h3 className="font-bold text-xs   md:hidden">
                    {data.result.name}
                </h3>
                <UserInfo
                    user={data?.result}
                    totalPost={userPost?.total || 0}
                ></UserInfo>
            </div>
        </>
    );
};

export default UserHeading;
