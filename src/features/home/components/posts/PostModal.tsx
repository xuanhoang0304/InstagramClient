import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
type PostModalProps = {
    Trigger: ReactNode;
    Content: ReactNode;
    className?: string;
};
const PostModal = ({ Trigger, Content, className }: PostModalProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [showPostModal, setShowPostModal] = useState(false);
    const handleClickOutside = () => {
        setShowPostModal(false);
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
                onClick={() => setShowPostModal(true)}
                className={cn(
                    `p-2 flex items-center justify-center hover:opacity-40`,
                    className
                )}
            >
                {Trigger}
            </button>
            {showPostModal && (
                // Modal
                <div className="bg-black/80 fixed inset-0 z-2">
                    <div
                        ref={ref}
                        className=" flex absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                        {Content}
                    </div>
                </div>
            )}
        </>
    );
};

export default PostModal;
