import {
  BellOff,
  CircleUser,
  ContactRound,
  Images,
  LogOut,
  MailSearch,
  MessageCircleX,
  OctagonAlert,
  Pin,
  Search,
  UserPlus,
  UserRoundX,
  Wrench,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { memo, useMemo, useState } from "react";

import ConfirmDelete from "@/components/layout/ConfirmDelete";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import AddGroupsChatBtn from "../../chat boxs/AddGroupsChatBtn";
import { IGroup } from "../../type";
import { handleDeleteMemberInGroupChat } from "../../utils";
import GroupSheetAction from "../GroupSheetAction";
import GroupChatFindMsgWrapper from "./FindMessage/GroupChatFindMsgWrapper";
import GroupChatMediaManager from "./ManagerMedia/GroupChatMediaManager";
import GroupChatManagerMembers from "./ManagerMember/GroupChatManagerMembers";

type Props = {
  group: IGroup;
  step: string;
  onSetStep: (step: string) => void;
};

const GroupChatManagerContainer = ({ group, step, onSetStep }: Props) => {
  const { myUser } = useMyStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const memberIds = useMemo(() => {
    return group.members.map((u) => `"${u._id}"`);
  }, [group.members.length]);
  const partner =
    group.isGroup === false
      ? group.members.find((u) => u._id !== String(myUser?._id))
      : undefined;

  const MappingContent: Record<string, React.ReactNode> = {
    media: (
      <GroupChatMediaManager
        onSetStep={onSetStep}
        group={group}
      ></GroupChatMediaManager>
    ),
    members: (
      <GroupChatManagerMembers group={group as IGroup} onSetStep={onSetStep} />
    ),
    findMessage: (
      <GroupChatFindMsgWrapper
        group={group as IGroup}
        onSetStep={onSetStep}
      ></GroupChatFindMsgWrapper>
    ),
  };

  const handleLeaveGroupChat = async () => {
    const data: {
      members: string[];
      action: "leave-group";
    } = {
      members: [myUser?._id as string],
      action: "leave-group",
    };
    await handleDeleteMemberInGroupChat(data, group._id, myUser?._id as string);
  };
  const handleShowConfirm = async () => {
    const isOwner = group.createdBy._id === String(myUser?._id);
    if (!isOwner) {
      await handleLeaveGroupChat();
      return;
    }
    setShowConfirm(true);
  };
  return (
    <SheetContent className="w-full! bg-primary-gray! gap-y-2 h-screen! overflow-y-auto! ">
      {!step ? (
        <>
          <SheetHeader className="flex flex-col gap-y-2 items-center py-5 ">
            <figure className="size-20 rounded-full">
              <Image
                src={
                  group?.isGroup
                    ? group.groupAvt || "/images/default.jpg"
                    : partner?.avatar || "/images/default.jpg"
                }
                alt="message-info-avt"
                width={80}
                height={80}
                className="size-full object-cover rounded-full"
              ></Image>
            </figure>
            <SheetTitle
              className={cn(
                "line-clamp-1 font-semibold",
                partner?.isReal && "flex items-center gap-x-2",
              )}
            >
              <p className="line-clamp-1">
                {group.isGroup ? group.groupName : partner?.name}
              </p>
              {partner?.isReal && (
                <svg
                  aria-label="Đã xác minh"
                  className="x1lliihq x1n2onr6 shrink-0"
                  fill="rgb(0, 149, 246)"
                  height="12"
                  role="img"
                  viewBox="0 0 40 40"
                  width="12"
                >
                  <title>Đã xác minh</title>
                  <path
                    d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                    fillRule="evenodd"
                  ></path>
                </svg>
              )}
            </SheetTitle>
            {group.isGroup && (
              <SheetDescription>{`${group.members.length} thành viên`}</SheetDescription>
            )}
            <div className="flex items-center justify-center gap-x-4 mt-4">
              <div className="flex flex-col gap-y-1 items-center">
                <button
                  onClick={() => onSetStep("findMessage")}
                  className="flex  items-center justify-center p-3 bg-second-button-background rounded-full hover:opacity-80 transition-opacity"
                >
                  <Search className="size-5 " />
                </button>
                <p className="text-xs ">Tìm tin nhắn</p>
              </div>
              {!group.isGroup ? (
                <div className="flex flex-col gap-y-1 items-center">
                  <Link
                    href={`/${partner?._id}`}
                    className="flex items-center justify-center p-3 bg-second-button-background rounded-full hover:opacity-80 transition-opacity"
                  >
                    <CircleUser className="size-5 " />
                  </Link>
                  <p className="text-xs ">Trang cá nhân</p>
                </div>
              ) : (
                <div className="flex flex-col gap-y-1 items-center">
                  <AddGroupsChatBtn
                    trigger={
                      <button
                        autoFocus={false}
                        className="flex items-center justify-center p-3 bg-second-button-background rounded-full hover:opacity-80 transition-opacity"
                      >
                        <UserPlus className="size-5 " />
                      </button>
                    }
                    action="add-member"
                    members={memberIds}
                    group={group}
                    side="top"
                  ></AddGroupsChatBtn>
                  <p className="text-xs ">Thêm thành viên</p>
                </div>
              )}
            </div>
          </SheetHeader>
          <div className="w-full h-2 bg-black"></div>
          <div>
            {group.isGroup ? (
              <GroupSheetAction
                icon={<ContactRound className="size-5  text-second-gray" />}
                title="Xem thành viên"
                onClick={() => {
                  onSetStep("members");
                }}
              ></GroupSheetAction>
            ) : (
              <GroupSheetAction
                icon={<MailSearch className="size-5  text-second-gray" />}
                title="Đổi biệt hiệu"
                onClick={() => {
                  alert("me");
                }}
              ></GroupSheetAction>
            )}

            <GroupSheetAction
              icon={<Images className="size-5  text-second-gray" />}
              title="Ảnh, file, link"
              onClick={() => {
                onSetStep("media");
              }}
            ></GroupSheetAction>
            <GroupSheetAction
              icon={<Pin className="size-5  text-second-gray" />}
              title="Tin nhắn đã ghim"
              onClick={() => {}}
            ></GroupSheetAction>
            <GroupSheetAction
              icon={<BellOff className="size-5  text-second-gray" />}
              title="Tắt thông báo"
              onClick={() => {}}
            ></GroupSheetAction>
            <GroupSheetAction
              icon={<OctagonAlert className="size-5  text-second-gray" />}
              title="Báo cáo"
              onClick={() => {}}
            ></GroupSheetAction>
            {group.isGroup &&
              group.groupAdmin.find((u) => u._id === String(myUser?._id)) && (
                <GroupSheetAction
                  icon={<Wrench className="size-5  text-second-gray" />}
                  title="Quản lý nhóm"
                  onClick={() => {}}
                ></GroupSheetAction>
              )}
            <GroupSheetAction
              icon={<MessageCircleX className="size-5  text-red-500" />}
              title="Xóa lịch sử trò chuyện"
              onClick={() => {}}
              classname="text-red-500!"
            ></GroupSheetAction>
            {group.isGroup ? (
              <GroupSheetAction
                icon={<LogOut className="size-5  text-red-500" />}
                title="Rời nhóm"
                onClick={handleShowConfirm}
                classname="text-red-500!"
              ></GroupSheetAction>
            ) : (
              <GroupSheetAction
                icon={<UserRoundX className="size-5  text-red-500" />}
                title="Chặn"
                onClick={() => {}}
                classname="text-red-500!"
              ></GroupSheetAction>
            )}
          </div>
          <SheetClose asChild className="absolute top-5 right-5">
            <button>
              <X className="size-5 text-second-gray" />
            </button>
          </SheetClose>
          {showConfirm && (
            <ConfirmDelete
              isOpen={showConfirm}
              action="Rời nhóm"
              actionTitle="Xác nhận rời nhóm"
              actionDescription={`Bạn có chắc muốn rời khỏi nhóm này không?`}
              onDelete={() => handleLeaveGroupChat()}
              onCancel={() => setShowConfirm(false)}
              onOpenChange={() => setShowConfirm(false)}
            ></ConfirmDelete>
          )}
        </>
      ) : (
        MappingContent[step]
      )}
    </SheetContent>
  );
};

export default memo(GroupChatManagerContainer);
