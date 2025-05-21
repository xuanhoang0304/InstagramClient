import { MessageCircleMore, UserPlus } from 'lucide-react';

import { UnFollowModal } from '@/features/home/components/posts/UnFollowModal';
import { cn } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { User } from '@/types/types';

type MiniUserActionsProps = {
    onFollowOrUnFollow: (id: string) => Promise<void>;
    user: User | undefined;
};
const MiniUserActions = ({
    user,
    onFollowOrUnFollow,
}: MiniUserActionsProps) => {
    const { myUser } = useMyStore();
    return (
        <>
            {myUser?.followings.includes(String(user?._id)) ? (
                <div className="flex items-center gap-x-2 mt-4 px-4">
                    <button className="bg-second-blue px-9 py-[6px] rounded-[8px] flex items-center gap-x-2 hover:opacity-75 transition-colors">
                        <MessageCircleMore className="size-5" />
                        <p className="text-sm font-semibold">Nhắn tin</p>
                    </button>
                    <UnFollowModal
                        Trigger={
                            <button className="bg-[#262626] py-1.5 px-[39.9px] rounded-[8px] text-sm font-semibold hover:opacity-75 transition-colors">
                                Đang theo dõi
                            </button>
                        }
                        user={user}
                        onFollowFunc={onFollowOrUnFollow}
                    ></UnFollowModal>
                </div>
            ) : (
                <button
                    onClick={() => onFollowOrUnFollow(user?._id as string)}
                    className={cn(
                        "bg-second-blue hover:opacity-75 transition-colors mt-4 py-[7px] flex items-center justify-center gap-x-2 w-[calc(100%-32px)] mx-auto rounded-[8px]",
                        myUser?._id === user?._id && "hidden"
                    )}
                >
                    <UserPlus className="size-5" />
                    <p className="text-sm font-semibold">Theo dõi</p>
                </button>
            )}
        </>
    );
};

export default MiniUserActions;
