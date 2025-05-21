"use client";
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { cn } from '@/lib/utils';
import { useRepliesStore } from '@/store/repliesStore';
import { useMyStore } from '@/store/zustand';
import { IPost } from '@/types/types';

type PostModalProps = {
    Trigger: ReactNode;
    Content: ReactNode;
    className?: string;

    post: IPost | null;
};
const PostModal = ({ Trigger, Content, className, post }: PostModalProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const { resetReplies } = useRepliesStore();
    const { settargetCmt } = useMyStore();

    const handleClickOutside = () => {
        settargetCmt(null);
        resetReplies();
        setShowPostModal(false);
        window.history.pushState({}, "", "/");
    };
    const handleOpenModal = () => {
        setShowPostModal(true);
        window.history.pushState({}, "", `/post/${post?._id}`);
    };
    useOnClickOutside(ref as React.RefObject<HTMLElement>, handleClickOutside);

    useEffect(() => {
        if (showPostModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showPostModal]);

    return (
        <>
            <button
                onClick={handleOpenModal}
                className={cn(
                    `p-2 flex items-center justify-center hover:opacity-40`,
                    className
                )}
            >
                {Trigger}
            </button>
            {showPostModal && (
                // Modal
                <div className="bg-black/80 fixed flex items-center justify-center inset-0 z-10">
                    <div
                        ref={ref}
                        className=" flex max-h-[588px] shadow-[0_0_23px_0_rgba(255,255,255,0.2)] rounded-lg"
                    >
                        {Content}
                    </div>
                </div>
            )}
        </>
    );
};

export default PostModal;
