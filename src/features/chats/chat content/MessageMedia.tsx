import Image from 'next/image';
import { RefObject, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { Media } from '@/components/layout/SideBar/type';
import { cn } from '@/lib/utils';

import MessageMediaDialog from './MessageMediaDialog';

interface Props {
    media: Media[];
    isCurUser: boolean;
    isParent: boolean;
}
const MessageMedia = ({ media, isCurUser, isParent }: Props) => {
    const [showMedia, setShowMedia] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const handleClose = () => {
        setShowMedia(false);
    };
    useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
    return (
        <>
            <ul
                onClick={() => {
                    if (!isParent) return;
                    setShowMedia(true);
                }}
                className={cn(
                    "relative w-[200px] h-[170px] mt-1 rounded-lg cursor-pointer",
                    !isParent && "w-[100px] h-[85px] mt-0", isCurUser && "self-end"
                )}
            >
                {media.slice(0, 2).map((item, index) => {
                    const zIndex = -1 * (index - 1);
                    return (
                        <li
                            key={item.path}
                            style={{
                                zIndex,
                            }}
                            className={cn(
                                `absolute top-0 size-full `,
                                isCurUser
                                    ? "right-0 nth-[2]:right-[10px] nth-[2]:-rotate-3"
                                    : "nth-[2]:left-[10px] nth-[2]:rotate-3"
                            )}
                        >
                            {item.type === "image" ? (
                                <figure className="size-full rounded-lg">
                                    <Image
                                        src={item.path}
                                        alt="media-message"
                                        width={400}
                                        height={400}
                                        className="size-full object-cover rounded-lg"
                                    ></Image>
                                </figure>
                            ) : (
                                <div className="size-full rounded-lg">
                                    <video
                                        className="size-full object-cover rounded-lg"
                                        src={item.path}
                                    ></video>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
            {showMedia && (
                <div className="fixed z-[100] inset-0 bg-black/70 flex justify-center items-center">
                    <div
                        ref={ref}
                        className="md:max-w-[500px] w-full h-[60%] md:h-[80%] flex flex-col justify-between md:gap-y-8 gap-y-4 "
                    >
                        <MessageMediaDialog media={media}></MessageMediaDialog>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageMedia;
