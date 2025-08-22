import dayjs from 'dayjs';
import { Copy, EllipsisVertical, Send, Trash } from 'lucide-react';
import { RefObject, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useOnClickOutside } from 'usehooks-ts';

import ConfirmDelete from '@/components/layout/ConfirmDelete';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub,
    DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { socket } from '@/configs/socket';
import { useMyStore } from '@/store/zustand';

import { useMessageStore } from '../MessageStore';
import { IMessageFE } from '../type';

interface Props {
    message: IMessageFE;
    isCurUser: boolean;
}

export function MessageActionBtns({ message, isCurUser }: Props) {
    const { myUser } = useMyStore();
    const { messageList } = useMessageStore();
    const { msgGroupId } = useMessageStore();
    const [openDialog, setOpenDialog] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);
    const { setTargetMessage } = useMessageStore();
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const handleOpenChangeDialog = () => {
        setOpenDialog(!openDialog);
    };
    const handleDeleteMessage = async (messageId: string) => {
        const isLatest = messageList.length > 1 && messageList[0]._id === messageId;
        socket.emit("delete-message", {
            messageId,
            curUserId: myUser?._id,
            groupId: msgGroupId,
            lastMessage: isLatest ? messageList[1]._id : null,
            isFristMessage: messageList.length == 1 && messageList[0]._id === messageId,
        });
        setOpenDialog(false);
    };
    const handleCopy = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(message.text || "");
                toast.success("Đã sao chép tin nhắn");
            } else {
                console.error(
                    "Clipboard API không được hỗ trợ trong trình duyệt này."
                );
            }
        } catch (err) {
            console.error("Lỗi khi sao chép:", err);
        }
    };
    useOnClickOutside(
        dialogRef as RefObject<HTMLDivElement>,
        handleCloseDialog
    );

    return (
        <div className="lg:opacity-0 group-hover:opacity-100 ">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 !bg-primary-gray">
                    <DropdownMenuLabel>
                        <p className="self-center text-second-gray text-xs font-semibold ">
                            <span className="text-[10px] mr-1">
                                {dayjs(String(message.createdAt)).format(
                                    "H:mm"
                                )}
                            </span>
                            {dayjs(String(message.createdAt)).format(
                                "DD/MM/YYYY"
                            )}
                        </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="!bg-second-gray" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="dark:focus:bg-second-button-background cursor-pointer">
                            Chuyển tiếp
                            <DropdownMenuShortcut>
                                <Send />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleCopy}
                            className="dark:focus:bg-second-button-background cursor-pointer"
                        >
                            Sao chép
                            <DropdownMenuShortcut>
                                <Copy />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="!bg-second-gray" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            onClick={() => setTargetMessage(message)}
                            className="dark:focus:bg-second-button-background cursor-pointer"
                        >
                            Trả lời
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                Bày tỏ cảm xúc
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem className="dark:focus:bg-second-button-background cursor-pointer">
                                        Like
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="dark:focus:bg-second-button-background cursor-pointer">
                                        Phẫn nộ
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="!bg-second-gray" />
                                    <DropdownMenuItem className="dark:focus:bg-second-button-background cursor-pointer">
                                        Hủy
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        {isCurUser && (
                            <>
                                <DropdownMenuSeparator className="!bg-second-gray" />
                                <DropdownMenuItem
                                    onSelect={() => {
                                        setOpenDialog(true);
                                    }}
                                    className="!font-semibold !text-red-500 dark:focus:bg-second-button-background cursor-pointer"
                                >
                                    Thu hồi
                                    <DropdownMenuShortcut>
                                        <Trash className="text-red-500" />
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>

            {openDialog && (
                <ConfirmDelete
                    action="Thu hồi"
                    actionTitle="Thu hồi tin nhắn"
                    actionDescription="Bạn và người nhận sẽ không thể thấy được tin nhắn này nữa"
                    isOpen={openDialog}
                    onCancel={handleCloseDialog}
                    onDelete={() => handleDeleteMessage(message._id)}
                    onOpenChange={handleOpenChangeDialog}
                    inModal
                ></ConfirmDelete>
            )}
        </div>
    );
}
