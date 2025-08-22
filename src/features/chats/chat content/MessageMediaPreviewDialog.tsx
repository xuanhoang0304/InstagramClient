import { CircleX } from 'lucide-react';
import Image from 'next/image';

import { Media } from '@/components/layout/SideBar/type';
import {
    Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface Props {
    file: Media;
}
export function MessageMediaPreviewDialog({ file }: Props) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {file.type === "image" ? (
                    <figure className="size-[60px] rounded-lg">
                        <Image
                            src={file.path || "/images/default.jpg"}
                            alt="message media"
                            width={60}
                            height={60}
                            className="rounded-lg size-full object-cover"
                        ></Image>
                    </figure>
                ) : (
                    <video
                        src={file.path}
                        className="size-[60px] rounded-lg"
                    ></video>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] !max-h-[425px] !bg-primary-gray p-3">
                <DialogTitle hidden>Edit profile</DialogTitle>
                {file.type === "image" ? (
                    <figure className="size-full rounded-lg">
                        <Image
                            src={file.path || "/images/default.jpg"}
                            alt="message media"
                            width={800}
                            height={800}
                            className="rounded-lg size-full object-cover"
                        ></Image>
                    </figure>
                ) : (
                    <video
                        src={file.path}
                        className="size-full rounded-lg"
                        controls
                    ></video>
                )}
                <DialogFooter className="absolute -right-1 -top-3">
                    <DialogClose asChild>
                        <button className=" bg-second-button-background rounded-full">
                            <CircleX className={cn("size-6")} />
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
