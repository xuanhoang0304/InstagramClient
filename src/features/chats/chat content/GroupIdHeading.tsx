import { ArrowLeft, CircleAlert, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { socket } from '@/configs/socket';
import { useMyStore } from '@/store/zustand';

import { IGroup } from '../type';

type Props = {
    group: IGroup | undefined;
};
const GroupIdHeading = ({ group }: Props) => {
    const { myUser } = useMyStore();
    const partner = !group?.isGroup
        ? group?.members.find((item) => item._id !== myUser?._id)
        : null;
    const handleCallVideo = () => {
        socket.emit("calling", { user: myUser, group });
    };
    return (
        <header className="flex justify-between items-center p-4 border-b bg-black border-primary-gray absolute top-0 left-0 right-0 z-10">
            <div className="flex items-center gap-x-2">
                <button
                    onClick={() => {
                        window.history.back();
                    }}
                    className="px-2 py-1 flex lg:hidden items-center justify-center"
                >
                    <ArrowLeft />
                </button>
                <Link
                    href={`/${
                        !group?.isGroup ? partner?._id : `chats/${group._id}`
                    }`}
                >
                    <figure className="size-[44px] rounded-full">
                        <Image
                            src={
                                group?.groupAvt ||
                                (!group?.isGroup && partner?.avatar) ||
                                "/images/default.jpg"
                            }
                            alt="user chat avt"
                            width={100}
                            height={100}
                            className="size-full object-cover rounded-full"
                        ></Image>
                    </figure>
                </Link>
                <div>
                    <h2 className="font-semibold line-clamp-1 ">
                        {group?.groupName || (!group?.isGroup && partner?.name)}
                    </h2>
                    {group?.isGroup ?<p className="text-xs text-second-gray">{group.members.length} thành viên</p> : <p className="text-xs text-second-gray">Hoạt động</p>}
                </div>
            </div>
            <div className="flex items-center gap-x-2">
                <button
                    onClick={handleCallVideo}
                    className="size-10 flex items-center justify-center"
                >
                    <Phone className="hover:fill-primary-white transition-colors" />
                </button>
                <button className="size-10 flex items-center justify-center">
                    <CircleAlert className="hover:fill-primary-white transition-colors hover:text-primary-gray" />
                </button>
            </div>
        </header>
    );
};

export default GroupIdHeading;
