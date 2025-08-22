import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';

import { IGroup } from '../type';

interface Props {
    group: IGroup | undefined;
}
const MessageProfile = ({ group }: Props) => {
    const { myUser } = useMyStore();
    const partner = !group?.isGroup
        ? group?.members.find((user) => user._id !== myUser?._id)
        : null;
    if (group?.isGroup) {
        return (
            <div className={cn("shrink-0 self-center text-center")}>
                <figure className="size-[120px] rounded-full mx-auto">
                    <Image
                        src={group.groupAvt || "/images/default.jpg"}
                        alt="group avt"
                        width={120}
                        height={120}
                        className="size-full object-cover rounded-full"
                    ></Image>
                </figure>
                <h2 className="text-second-gray font-semibold mt-3">
                    Nhóm {group.groupName || "group name"}
                </h2>
                <p className="text-xs text-second-gray font-semibold mt-1">
                    {group.members.length} thành viên
                </p>
            </div>
        );
    }
    return (
        <div className={cn("shrink-0 self-center text-center")}>
            <figure className="size-[120px] rounded-full mx-auto">
                <Image
                    src={partner?.avatar || "/images/default.jpg"}
                    alt="group avt"
                    width={120}
                    height={120}
                    className="size-full object-cover rounded-full"
                ></Image>
            </figure>
            <h2 className=" text-2xl font-semibold mt-3">
                {partner?.name}
            </h2>
            <Link
                href={`/${partner?._id}`}
                className="px-3 py-2 rounded-lg block mt-3 hover:bg-second-button-background bg-primary-dark-hover transition-colors"
            >
                Xem trang cá nhân
            </Link>
        </div>
    );
};

export default MessageProfile;
