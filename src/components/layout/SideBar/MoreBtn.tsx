import { deleteCookie, getCookie } from "cookies-next";
import { AlignJustify } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/configs/axios";
import { SwitchUserContent } from "@/features/home/components/SwitchUserContent";
import { cn, handleError } from "@/lib/utils";
import { HttpResponse } from "@/types/types";

interface Props {
  type: "normal" | "short";
  showDialog: boolean;
}
export function MoreBtn({ type, showDialog }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const handleChange = () => {
    setIsOpen(!isOpen);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleLogout = async () => {
    try {
      const accessToken = getCookie("accessToken");
      const refreshToken = getCookie("refreshToken");
      const res: HttpResponse = await apiClient.fetchApi(
        `/auth/logout?accessToken=${accessToken}&refreshToken=${refreshToken}`,
      );
      if (res.code === 200) {
        deleteCookie("accessToken");
        deleteCookie("refreshToken");
        toast.success("Đăng xuất thành công");
        router.push("/login");
      }
    } catch (error) {
      handleError("handleLogout", error);
    }
  };
  return (
    <DropdownMenu open={isOpen} onOpenChange={handleChange} modal={false}>
      <DropdownMenuTrigger asChild className="">
        <button
          className={cn(
            "p-3 flex items-center gap-x-2 bg-transparent dark:hover:bg-primary-dark-hover hover:bg-second-gray rounded-lg",
            showDialog && "w-max",
          )}
        >
          <AlignJustify />
          <p
            className={cn(
              "hidden",
              type == "normal" && !showDialog && "lg:block",
            )}
          >
            Xem thêm
          </p>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[266px] !bg-primary-gray px-2"
        align="end"
        alignOffset={50}
        sideOffset={type == "normal" ? -10 : -30}
        side="left"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-4 lg:py-2 hover:!bg-second-button-background">
            Cài đặt
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-4 lg:py-2 hover:!bg-second-button-background">
            Hoạt động của bạn
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-4 lg:py-2 hover:!bg-second-button-background">
            Chuyển chế độ
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-4 lg:py-2 hover:!bg-second-button-background">
            Báo cáo sự cố
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="!bg-second-gray !my-1" />

        <SwitchUserContent
          trigger={
            <button className="p-2 w-full rounded-[6px] text-sm text-left hover:!bg-second-button-background">
              Chuyển tài khoản
            </button>
          }
          onClose={handleClose}
        ></SwitchUserContent>

        <DropdownMenuItem
          onClick={handleLogout}
          className="py-4 lg:py-2 hover:!bg-second-button-background"
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
