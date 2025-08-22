import Link from 'next/link';

import { handleFollowingUser, handleMutateWithKey } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { User } from '@/types/types';

import MiniUserProfile from './posts/miniUser/MiniUserProfile';

interface ISuggestionItem {
    user: User;
}
const SuggestionItem = ({ user }: ISuggestionItem) => {
    const { setMyUser } = useMyStore();
    const handlFollowOrUnFollow = async (id: string) => {
        const res = await handleFollowingUser(id);
        if (res?.code === 200) {
            // handleMutateWithKey("/api/posts");
            handleMutateWithKey("/users");
            handleMutateWithKey("/posts/following?sort=createdAt&");
            setMyUser(res.data);
        }
    };
    return (
        <li className=" flex justify-between items-center">
            <div className=" flex items-center gap-x-2">
                <Link href={`/${user?._id}`}>
                    <MiniUserProfile user={user}></MiniUserProfile>
                </Link>
                <div className="flex flex-col">
                    <Link
                        href={`/${user?._id}`}
                        className=" text-sm leading-[18px] font-semibold max-w-[150px] line-clamp-1"
                    >
                        {user?.name}
                    </Link>
                    <p className="text-second-gray text-sm leading-[18px] line-clamp-1 max-w-[100px]">
                        {user?.bio ? user.bio : "Gợi ý cho bạn"}
                    </p>
                </div>
            </div>
            <button
                onClick={() => handlFollowOrUnFollow(user._id)}
                className="text-primary-blue font-semibold text-xs hover:text-primary-blue-hover"
            >
                Theo dõi
            </button>
        </li>
    );
};

export default SuggestionItem;
