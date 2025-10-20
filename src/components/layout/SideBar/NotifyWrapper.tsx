import { Heart } from "lucide-react";
import { memo, RefObject, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";

import NotifyList from "./NotifyList";

interface NotifyWrapperProps {
  showDialog: string;
  type: "normal" | "short";
  onSetShowDialog: (value: "" | "notify" | "search") => void;
}
const isNewNotify = true;
const NotifyWrapper = ({
  onSetShowDialog,
  showDialog,
  type,
}: NotifyWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as RefObject<HTMLDivElement>, () => {
    onSetShowDialog("");
  });
  const handleOpen = () => {
    if (showDialog) {
      onSetShowDialog("");
      return;
    }
    onSetShowDialog("notify");
  };
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <Sheet modal={true} open={showDialog === "notify"}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            asChild
            onClick={handleOpen}
            className={cn("flex items-center p-3 gap-x-2 w-full")}
          >
            <SheetTrigger asChild>
              <button>
                <div className="relative">
                  {isNewNotify && (
                    <div className="size-2 bg-red-500 rounded-full absolute top-0.5 -right-0.5"></div>
                  )}
                  <Heart />
                </div>

                {type === "normal" && !showDialog && (
                  <p className="line-clamp-1 hidden lg:block">Thông báo</p>
                )}
              </button>
            </SheetTrigger>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            className={cn(!showDialog && type === "normal" && "hidden")}
          >
            <p>Thông báo của bạn</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent
        ref={ref}
        side="left"
        className="!bg-black !left-[72px] !border-primary-gray !border-2 !rounded-r-lg gap-y-0 "
        overlayClassName="bg-transparent"
      >
        <SheetTitle className="text-2xl font-bold mt-6 ml-6">
          Thông báo
        </SheetTitle>
        <Separator className="w-full !bg-primary-gray mt-3 h-0.5"></Separator>
        <NotifyList></NotifyList>
      </SheetContent>
    </Sheet>
  );
};

export default memo(NotifyWrapper);
