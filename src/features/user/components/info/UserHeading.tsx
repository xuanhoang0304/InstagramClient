"use client";

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';

import Loading from '@/app/loading';
import envConfig from '@/configs/envConfig';
import { useApi } from '@/hooks/useApi';
import { getMe } from '@/types/types';

import UserInfo from './UserInfo';

const UserHeading = () => {
    const { userId } = useParams();
    const { data, isLoading } = useApi<getMe>(
        `${envConfig.BACKEND_URL}/users/${userId}`
    );

    if (isLoading) {
        return <Loading className="absolute"></Loading>;
    }
    if (!data?.result._id) {
        notFound();
    }
    return (
        <header className="flex gap-x-7">
            {/* avt */}
            <div className="w-[284px] ">
                <figure className="size-[150px] rounded-full mx-auto">
                    <Image
                        src={data?.result?.avatar || "/images/default.jpg"}
                        alt="user-avt"
                        width={300}
                        height={300}
                        className="size-full object-cover rounded-full"
                    ></Image>
                </figure>
            </div>
            {/* Info */}
            <UserInfo user={data?.result}></UserInfo>
        </header>
    );
};

export default UserHeading;
