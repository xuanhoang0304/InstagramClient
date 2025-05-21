import DOMPurify from 'dompurify';
import parse from 'html-react-parser';
import { ChevronDown, Ellipsis } from 'lucide-react';
import { useParams } from 'next/navigation';

import envConfig from '@/configs/envConfig';
import MiniUserDetails from '@/features/home/components/posts/miniUser/MiniUserDetails';
import { UnFollowModal } from '@/features/home/components/posts/UnFollowModal';
import { useApi } from '@/hooks/useApi';
import { handleFollowingUser, handleGetMe, textWithLinks } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { getPostsByCreated, User } from '@/types/types';

type UserInfoProps = {
    user: User;
};
const UserInfo = ({ user }: UserInfoProps) => {
    const { userId } = useParams();
    const { myUser, setMyUser } = useMyStore();
    const { data: userPost } = useApi<getPostsByCreated>(
        user._id
            ? `${envConfig.BACKEND_URL}/posts/?filters={"createdBy": ["${user._id}"]}`
            : null
    );

    const handlFollowOrUnFollow = async (id: string) => {
        await handleFollowingUser(id);
        const res = await handleGetMe();
        const newUser = res?.result as User;
        setMyUser(newUser);
    };
    const sanitizedHTML = DOMPurify.sanitize(textWithLinks(user.bio || ""));

    const bioParsed = parse(sanitizedHTML);

    return (
        <div>
            <div className="flex items-center gap-x-2">
                <h1 className="text-xl mr-4">{user.name}</h1>
                <div className="flex gap-x-2 items-center font-semibold text-sm">
                    {userId === myUser?._id ? (
                        <>
                            <button className="bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                                Chỉnh sửa trang cá nhân
                            </button>
                            <button className="bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                                Xem kho lưu trữ
                            </button>
                        </>
                    ) : myUser?.followings.includes(userId as string) ? (
                        <>
                            <UnFollowModal
                                Trigger={
                                    <button className="flex items-center gap-x-1 bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                                        <p>Đang theo dõi</p>
                                        <ChevronDown className="size-4" />
                                    </button>
                                }
                                user={user}
                                onFollowFunc={handlFollowOrUnFollow}
                            ></UnFollowModal>
                            <button className="bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                                Nhắn tin
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={async () =>
                                    handlFollowOrUnFollow(user._id)
                                }
                                className="bg-primary-blue hover:bg-second-blue text-primary-white px-4 py-[6px] rounded-[8px] transition-colors"
                            >
                                Theo dõi
                            </button>
                            <button className="bg-second-button-background hover:bg-primary-gray px-4  transition-colors rounded-[8px] py-[6px]">
                                Nhắn tin
                            </button>
                        </>
                    )}
                    <button>
                        <Ellipsis />
                    </button>
                </div>
            </div>
            {/* Details */}
            <div className="flex gap-x-8 items-center mt-4">
                <MiniUserDetails
                    className="flex-row gap-x-2"
                    desc="bài viết"
                    quantity={userPost?.total || 0}
                ></MiniUserDetails>
                <MiniUserDetails
                    className="flex-row gap-x-2"
                    desc="người theo dõi"
                    quantity={user.followers?.length || 0}
                ></MiniUserDetails>
                <MiniUserDetails
                    className="flex-row gap-x-2"
                    desc="đang theo dõi"
                    quantity={user.followings?.length || 0}
                ></MiniUserDetails>
            </div>
            {/* Bio */}
            <p>{bioParsed}</p>
        </div>
    );
};

export default UserInfo;
