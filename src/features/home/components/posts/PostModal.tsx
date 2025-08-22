"use client";
import { ReactNode, useEffect, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { useRepliesStore } from '@/store/repliesStore';
import { useMyStore } from '@/store/zustand';

type PostModalProps = {
    Content: ReactNode;
    className?: string;
    onCloseModal: () => void;
};
const PostModal = ({ Content, onCloseModal }: PostModalProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const { resetReplies } = useRepliesStore();
    const { settargetCmt } = useMyStore();

    const handleClickOutside = () => {
        settargetCmt(null);
        resetReplies();
        onCloseModal();
    };

    useOnClickOutside(ref as React.RefObject<HTMLElement>, handleClickOutside);

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="bg-black/80 fixed flex items-center justify-center inset-0 z-10">
            <div
                ref={ref}
                className=" flex lg:max-h-[585px] w-[80%] justify-center rounded-lg"
            >
                {Content}
            </div>
        </div>
    );
};

export default PostModal;
