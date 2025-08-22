import { Ellipsis } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RefObject, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import ConfirmDelete from '@/components/layout/ConfirmDelete';
import { handleDeletePost, handleFollowingUser, handleMutateWithKey } from '@/lib/utils';
import { usePostStore } from '@/store/postStore';
import { useMyStore } from '@/store/zustand';
import { IPost } from '@/types/types';

import ModalUnfollowBtn from './ModalUnfollowBtn';

type ModalReportBtnProps = {
    post: IPost | null;
};
const ModalReportBtn = ({ post }: ModalReportBtnProps) => {
    const { myUser, setMyUser } = useMyStore();
    const { setTargetPost } = usePostStore();

    const [showModal, setShowModal] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const handleClose = () => {
        setShowModal(false);
    };

    const handlFollowOrUnFollow = async (id: string) => {
        const res = await handleFollowingUser(id);
        if (res?.code === 200) {
            handleMutateWithKey("/users");
            setMyUser(res.data);
        }
        setShowModal(false);
    };
    const handleOpenConfirmDelete = () => {
        setShowConfirmDelete(!showConfirmDelete);
    };
    const handleCancel = () => {
        setShowConfirmDelete(false);
    };
    const handleDeletePostById = async () => {
        const result = await handleDeletePost(post?._id as string);
        setShowModal(false);
        setShowConfirmDelete(false);
        if (result) {
            setTargetPost({
                post: result.data,
                action: "delete",
            });
            router.push(`/${myUser?._id}/${result.data.isReel ? "reel" : ""}`);
        }
    };
    useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [showModal]);
    return (
        <>
            <button onClick={() => setShowModal(true)}>
                <Ellipsis className="cursor-pointer text-primary-white" />
            </button>
            {showModal && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center">
                    <div
                        ref={ref}
                        className="max-w-[400px] rounded-lg w-full dark:!bg-[#262626] bg-primary-gray text-second-gray focus-visible:outline-none flex p-0 flex-col gap-y-0 border-none outline-none text-sm text-center"
                    >
                        {myUser?._id === post?.createdBy._id ? (
                            <ConfirmDelete
                                trigger={"Xóa bài biết"}
                                isOpen={showConfirmDelete}
                                action="Xóa bài biết"
                                actionTitle="Xóa bài biết"
                                actionDescription="Bạn có chắc chắn muốn xóa bài biết này không?"
                                onDelete={handleDeletePostById}
                                onCancel={handleCancel}
                                onOpenChange={handleOpenConfirmDelete}
                                inModal
                            ></ConfirmDelete>
                        ) : (
                            <button className="px-2 py-[13.6px] font-bold text-[#ed4956] border-b dark:border-[#363636] border-solid">
                                Báo cáo
                            </button>
                        )}
                        {myUser?.followings.includes(
                            String(post?.createdBy._id)
                        ) && (
                            <ModalUnfollowBtn
                                user={post?.createdBy}
                                onFollowFunc={handlFollowOrUnFollow}
                            ></ModalUnfollowBtn>
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
                        <button
                            onClick={handleClose}
                            className="px-2 py-[14px]"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ModalReportBtn;
