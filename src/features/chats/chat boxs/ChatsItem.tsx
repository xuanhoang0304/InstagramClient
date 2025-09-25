import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';

import envConfig from '@/configs/envConfig';
import { socket } from '@/configs/socket';
import { useApi } from '@/hooks/useApi';
import { cn } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { HttpResponse } from '@/types/types';

import { IGroup, IMessageFE } from '../type';

interface ChatsItemProps {
    item: IGroup;
}
interface IMessageResponseChatsItem extends HttpResponse {
    result: IMessageFE;
}
const ChatsItem = ({ item }: ChatsItemProps) => {
    const router = useRouter();
    const { groupId } = useParams();
    const { myUser } = useMyStore();
    const [onlineMembers, setOnlineMembers] = useState<string[] | []>([]);
    const partner = !item.isGroup
        ? item.members.find((user) => user._id !== myUser?._id)
        : null;
    const { data, isLoading } = useApi<IMessageResponseChatsItem>(
        item.lastMessage
            ? `${envConfig.BACKEND_URL}/api/chats/${item.lastMessage._id}`
            : ""
    );
    useEffect(() => {
        socket.emit("user-online-in-group", item._id);
        socket.on(
            "user-online-in-group",
            (data: { groupId: string; list: string[] }) => {
                if (data.groupId !== item._id) return;
                setOnlineMembers(data.list);
            }
        );
        return () => {
            socket.off("user-online-in-group");
        };
    }, [item._id]);
    if (isLoading) return null;
    return (
        <li
            className={cn(
                "flex items-center gap-x-3 px-6 py-2 cursor-pointer hover:bg-second-button-background",
                item._id === groupId && "bg-second-button-background"
            )}
            onClick={() => {
                router.push(`/chats/${item._id}`);
            }}
        >
            <figure className="size-[56px] rounded-full shrink-0 relative">
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
                {onlineMembers?.find(
                    (user) => user !== String(myUser?._id)
                ) && (
                    <span className="bg-green-500 size-4 absolute bottom-0 right-0 rounded-full border-2 border-black"></span>
                )}
            </figure>
            <div>
                <h3
                    className={cn(
                        "line-clamp-1 ",
                        item.isGroup == false && "flex items-center gap-x-1"
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

                {(data?.result.images.length || data?.result.videos.length) &&
                !data.result.text ? (
                    <p className="mt-0.5 text-second-gray text-sm font-semibold line-clamp-1">
                        {data?.result.sender.name === myUser?.name
                            ? "Bạn"
                            : `${data?.result.sender.name}`}
                        : đã gửi file đính kèm
                    </p>
                ) : (
                    <p className="mt-0.5 text-second-gray text-sm font-semibold line-clamp-1">
                        {data?.result.sender.name === myUser?.name
                            ? "Bạn"
                            : `${data?.result.sender.name}`}
                        : {data?.result.text}
                    </p>
                )}
            </div>
        </li>
    );
};

export default memo(ChatsItem);
