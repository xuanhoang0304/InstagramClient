import { CircleUser, EllipsisVertical, Trash, UserCog } from "lucide-react";
import Link from "next/link";
import { memo, RefObject, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useOnClickOutside } from "usehooks-ts";

import ConfirmDelete from "@/components/layout/ConfirmDelete";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/configs/axios";
import envConfig from "@/configs/envConfig";
import { cn, handleError } from "@/lib/utils";
import { HttpResponse, User } from "@/types/types";

import { IGroup } from "../../type";
import { handleDeleteMemberInGroupChat } from "../../utils";

interface GroupChatManagerActionBtnsProps {
  isOwner: boolean;
  isAdmin: boolean;
  group: IGroup;
  member: User;
  onSetMembers: (members: User[] | ((prev: User[]) => User[])) => void;
}

const GroupChatManagerActionBtns = ({
  isOwner,
  isAdmin,
  group,
  member,
  onSetMembers,
}: GroupChatManagerActionBtnsProps) => {
  const [open, setOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
  const handleDeleteMember = async (memberId: string) => {
    const data: {
      members: string[];
      action: "delete-member";
    } = {
      members: [memberId],
      action: "delete-member",
    };

    await handleDeleteMemberInGroupChat(
      data,
      group._id,
      memberId,
      onSetMembers,
    );
  };
  const handleUpdateRole = async (memberId: string) => {
    const data = {
      members: [memberId],
      action: "add-admin",
    };

    try {
      const res: HttpResponse = await apiClient.fetchApi(
        `/groups/${group._id}/members`,
        {
          data,
          method: "PUT",
        },
      );

      if (res.code === 200) {
        toast.success("Cập nhật quyền quản trị thành công");
        mutate(
          `${envConfig.BACKEND_URL}/api/groups/${group._id}`,
          (prev: (HttpResponse & { result: IGroup }) | undefined) => {
            if (!prev) return prev;
            return {
              ...prev,
              result: {
                ...prev.result,
                groupAdmin: !isAdmin
                  ? [...prev.result.groupAdmin, member]
                  : prev.result.groupAdmin.filter((u) => u._id !== member._id),
              },
            };
          },
          false,
        );
      }
    } catch (e) {
      handleError("handleDeleteMember", e);
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={cn(
          " p-3 cursor-pointer rounded-full bg-transparent hover:bg-second-button-background transition-colors",
          open && " pointer-events-none",
        )}
      >
        <EllipsisVertical className="size-5" />
      </button>
      {open && (
        <div
          ref={ref}
          className=" border border-second-gray bg-second-button-background z-[51] absolute top-14 right-0 flex flex-col rounded-lg first:rounded-t-lg last:rounded-b-lg"
        >
          <button
            className="p-2 flex items-center gap-x-2  bg-transparent hover:bg-gray-400/30 transition-colors "
            onClick={() => setShowConfirmDelete(true)}
          >
            <p className="text-left text-sm font-semibold flex-1">
              Xóa khỏi nhóm
            </p>
            <Trash className="size-5" />
          </button>
          <Separator className="w-full h-0.5 !bg-second-gray"></Separator>
          <Link
            href={`/${member._id}`}
            className="p-2 flex items-center gap-x-2  bg-transparent hover:bg-gray-400/30 transition-colors "
          >
            <p className="text-left text-sm font-semibold flex-1">
              Xem trang cá nhân
            </p>
            <CircleUser className="size-5" />
          </Link>
          {showConfirmDelete && (
            <ConfirmDelete
              action="Xóa khỏi nhóm"
              actionTitle="Xóa thành viên nhóm"
              actionDescription={`Bạn có chắc chắn muốn xóa thành viên này không?`}
              onDelete={() => handleDeleteMember(member._id)}
              onCancel={() => setShowConfirmDelete(false)}
              onOpenChange={() => setShowConfirmDelete(false)}
              isOpen={showConfirmDelete}
            ></ConfirmDelete>
          )}
          {isOwner && (
            <>
              <Separator className="w-full h-0.5 !bg-second-gray"></Separator>
              <button
                onClick={() => handleUpdateRole(member._id)}
                className="p-2 flex items-center gap-x-2  bg-transparent hover:bg-gray-400/30 transition-colors"
              >
                <p className="text-left text-sm font-semibold flex-1">
                  {isAdmin
                    ? " Thu hồi quyền quản trị viên"
                    : "Cấp quyền quản trị viên"}
                </p>
                <UserCog className="size-5" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default memo(GroupChatManagerActionBtns);
