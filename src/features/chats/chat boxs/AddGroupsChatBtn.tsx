import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { useOnClickOutside } from "usehooks-ts";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/configs/axios";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, handleError, handleMutateWithKey } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { HttpResponse, User } from "@/types/types";

import { IGroup, IGroupResponse } from "../type";
import AddGroupInput from "./AddGroupInput";
import GroupChatSuggestion from "./GroupChatSuggestion";

type SuggestionUserResponse = {
  result: {
    users: User[];
    totalUser: number;
  };
} & HttpResponse;
type AddGroupsChatBtnProps = {
  trigger: ReactNode;
  side?: "right" | "top" | "bottom" | "left";
  action?: "add-chat" | "add-member";
  members?: string[];
  group?: IGroup;
  onSetMembers?: (members: User[]) => void;
};
const AddGroupsChatBtn = ({
  trigger,
  side,
  action = "add-chat",
  members,
  group,
  onSetMembers,
}: AddGroupsChatBtnProps) => {
  const [open, setOpen] = useState(false);
  const [suggestionList, setSuggestionList] = useState<User[] | []>([]);
  const [searchTxt, setSearchTxt] = useState("");
  const debouncedSearchTxt = useDebounce(searchTxt, 200);
  const [page, setPage] = useState(1);
  const [selectedList, setSelectedList] = useState<User[] | []>([]);
  const [isGroup, setIsGroup] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { myUser } = useMyStore();
  const router = useRouter();
  const excludes = action === "add-chat" ? [`"${myUser?._id}"`] : members;
  const { data } = useApi<SuggestionUserResponse>(
    debouncedSearchTxt &&
      `${envConfig.BACKEND_URL}/api/users/?filters={"keyword": "${debouncedSearchTxt}","excludes": [${excludes}]}&page=${page}&limit=3`,
  );

  const handleClose = () => {
    setOpen(false);
    setSearchTxt("");
    setSuggestionList([]);
    setPage(1);
    setSelectedList([]);
    setIsGroup(false);
  };
  const handleSetSearchTxt = (txt: string) => {
    setSearchTxt(txt);
  };
  const handleSetSelectedList = (arr: User[] | []) => {
    setSelectedList(arr);
  };
  const handleCreateGroupChat = async () => {
    if (selectedList.length > 1 && !isGroup) {
      toast.error("Vui lòng check vào tạo nhóm để tiếp tục!");
      return;
    }
    try {
      const response: IGroupResponse = await apiClient.fetchApi(`groups/`, {
        data: {
          members: selectedList.map((item) => `${item._id}`),
          isGroup,
        },
        method: "POST",
      });
      if (response.code === 201) {
        handleClose();
        router.push(`/chats/${response.data._id}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.message === "Group chat is existed") {
          handleClose();
          router.push(`/chats/${error.response?.data.detail}`);
        } else handleError("handleCreateGroupChat", error);
      }
    }
  };
  const handleAddMember = async () => {
    const members = selectedList.map((item) => item._id);
    try {
      const res: HttpResponse & { data: IGroup } = await apiClient.fetchApi(
        `/groups/${group?._id}/members`,
        {
          method: "PUT",
          data: {
            members,
            action: "add-member",
          },
        },
      );
      if (res.code === 200) {
        toast.success("Thành viên mới đã được thêm vào nhóm");
        mutate(
          `${envConfig.BACKEND_URL}/api/groups/${group?._id}`,
          (prev: (HttpResponse & { result: IGroup }) | undefined) => {
            if (!prev) return prev;
            onSetMembers?.([...prev.result.members, ...selectedList]);
            return {
              ...prev,
              result: {
                ...prev.result,
                members: [...prev.result.members, ...selectedList],
              },
            };
          },
          false,
        );
        handleMutateWithKey(`groups/?filter={"userId":"${myUser?._id}`);
        handleClose();
      }
    } catch (error) {
      handleError("handleAddMember", error);
    }
  };
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
  useEffect(() => {
    if (data?.code == 200) {
      setSuggestionList(data.result.users);
    }
    if (!searchTxt) {
      setSuggestionList([]);
    }
  }, [data]);
  return (
    <Dialog open={open}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            autoFocus={false}
            asChild
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            {trigger}
          </TooltipTrigger>
          <TooltipContent side={side || "right"}>
            <p>{action === "add-chat" ? "Tin nhắn mới" : "Thêm thành viên"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent
        ref={ref}
        className="!bg-primary-gray border-none !px-0 !pt-2 pb-4 !block"
      >
        <DialogTitle className="text-center py-2">
          {action === "add-chat" ? "Tin nhắn mới" : "Thêm thành viên"}
        </DialogTitle>

        <AddGroupInput
          searchTxt={searchTxt}
          selectedList={selectedList}
          onSetSelectedList={handleSetSelectedList}
          onSetSearchTxt={handleSetSearchTxt}
          action={action}
        ></AddGroupInput>

        <div className="h-[300px] pt-3 border  overflow-y-auto ">
          {debouncedSearchTxt && (
            <GroupChatSuggestion
              list={suggestionList}
              totalSuggestion={data?.result.totalUser}
              selectedList={selectedList}
              onSetSelectedList={handleSetSelectedList}
            ></GroupChatSuggestion>
          )}
        </div>

        {selectedList.length > 0 && action == "add-chat" && (
          <div className="flex items-center mt-3 gap-x-2 ml-4">
            <Checkbox
              id="isGroup"
              onClick={() => setIsGroup(!isGroup)}
              className="!border-primary-white"
            />
            <label
              htmlFor="isGroup"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Tạo cuộc trò chuyện nhóm mới ?
            </label>
          </div>
        )}
        <div className="px-4 mt-3">
          <Button
            onClick={
              action === "add-chat" ? handleCreateGroupChat : handleAddMember
            }
            className={cn(
              "bg-second-blue hover:bg-primary-blue w-full text-primary-white",
              !selectedList.length && "pointer-events-none opacity-30",
            )}
          >
            {action === "add-chat" ? "Chat" : "Thêm thành viên"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupsChatBtn;
