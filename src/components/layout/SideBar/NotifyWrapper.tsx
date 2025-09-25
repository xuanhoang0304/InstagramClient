import { RefObject, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { Separator } from "@radix-ui/react-select";

import NotifyList from "./NotifyList";

interface NotifyWrapperProps {
  onCloseNotify: () => void;
}
const NotifyWrapper = ({ onCloseNotify }: NotifyWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as RefObject<HTMLDivElement>, onCloseNotify);

  return (
    <div className="fixed inset-0 z-50 left-[72px]">
      <div
        ref={ref}
        className="w-[400px] h-full border-2 border-primary-gray rounded-r-xl bg-black absolute top-0 left-0"
      >
        <p className="text-2xl font-bold mt-6 ml-6">Thông báo</p>
        <Separator className="w-full !bg-primary-gray mt-3 h-0.5"></Separator>
        <NotifyList></NotifyList>
      </div>
    </div>
  );
};

export default NotifyWrapper;
