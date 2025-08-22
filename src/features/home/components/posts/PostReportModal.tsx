import { Ellipsis } from 'lucide-react';
import { useState } from 'react';

import {
    Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { PostProp } from '@/features/home/components/posts/type';
import { UnFollowModal } from '@/features/home/components/posts/UnFollowModal';
import { handleFollowingUser, handleMutateWithKey } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';

function PostReportModal({ item }: PostProp) {
    const { myUser, setMyUser } = useMyStore();
    const [open, setOpen] = useState(false);
    const handlFollowOrUnFollow = async (id: string) => {
        const data = await handleFollowingUser(id);
        if (data?.code === 200) {
            handleMutateWithKey("/users");
            setMyUser(data.data);
        }
        setOpen(false);
    };
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Ellipsis className="cursor-pointer" />
            </DialogTrigger>
            <DialogContent
                showclose="false"
                className="sm:max-w-[400px]  dark:!bg-[#262626] focus-visible:outline-none flex p-0 flex-col gap-y-0 border-none outline-none text-sm text-center"
            >
                <DialogTitle className="m-0 p-0 hidden"></DialogTitle>
                <button className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid">
                    Báo cáo
                </button>
                {myUser?.followings.includes(
                    String(item?.createdBy._id as string)
                ) && (
                    <UnFollowModal
                        Trigger={
                            <button className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid">
                                Bỏ theo dõi
                            </button>
                        }
                        onFollowFunc={handlFollowOrUnFollow}
                        user={item?.createdBy}
                    ></UnFollowModal>
                )}
                <button className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid">
                    Thêm vào mục yêu thích
                </button>
                <button className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid">
                    Đi đến bài viết
                </button>
                <button className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid">
                    Chia sẻ lên...
                </button>
                <button className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid">
                    Sao chép liên kết
                </button>
                <button className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid">
                    Nhúng
                </button>
                <button className="px-2 py-[13.6px] border-b dark:border-[#363636] border-solid">
                    Giới thiệu về tài khoản này
                </button>
                <DialogClose asChild className="px-2 py-[14px]">
                    <button>Hủy</button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
export default PostReportModal;
