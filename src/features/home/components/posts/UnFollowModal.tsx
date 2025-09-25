"use client";

import Image from "next/image";
import { ReactNode, RefObject, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User } from "@/types/types";

type ToggleFollowBtnProps = {
  Trigger?: ReactNode;
  user: User | undefined;
  modal?: boolean;
  onFollowFunc: (id: string) => void;
};
export function UnFollowModal({
  user,
  onFollowFunc,
  Trigger,
  modal,
}: ToggleFollowBtnProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref as RefObject<HTMLDivElement>, handleClose);
  if (modal) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#262626] flex-1 py-1.5 px-4 whitespace-nowrap md:px-9 rounded-[8px] text-sm font-semibold hover:opacity-75 transition-colors"
        >
          Đang theo dõi
        </button>
        {open && (
          <div className="bg-black/60 fixed inset-0 flex items-center justify-center">
            <div
              ref={ref}
              className="!max-w-[400px] w-full h-auto !bg-primary-gray flex flex-col items-center gap-y-0 p-0 rounded-[12px]"
            >
              <div className="py-8">
                <figure className="size-[90px] rounded-full mx-auto">
                  <Image
                    width={90}
                    height={90}
                    src={user?.avatar || "/images/default.jpg"}
                    alt="avt"
                    className="size-full rounded-full object-cover"
                  ></Image>
                </figure>
                <h3 className="mt-8 text-sm">Bỏ theo dõi @{user?.name}?</h3>
              </div>

              <button
                onClick={() => onFollowFunc(user?._id as string)}
                tabIndex={0}
                className="text-red-500 font-bold whitespace-nowrap py-[12.4px] text-sm border-y border-second-gray w-full"
              >
                Bỏ theo dõi
              </button>

              <button
                onClick={handleClose}
                type="button"
                className="text-sm py-[14px] w-full"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent className="!max-w-[400px] !bg-primary-gray flex flex-col items-center gap-y-0 p-0 rounded-[12px]">
        <DialogTitle className="hidden !p-0 !border-none "></DialogTitle>
        <div className="py-8">
          <figure className="size-[90px] rounded-full mx-auto">
            <Image
              width={90}
              height={90}
              src={user?.avatar || "/images/default.jpg"}
              alt="avt"
              className="size-full rounded-full object-cover"
            ></Image>
          </figure>
          <h3 className="mt-8 text-sm">Bỏ theo dõi @{user?.name}?</h3>
        </div>

        <button
          onClick={() => onFollowFunc(user?._id as string)}
          tabIndex={0}
          className="text-red-500 font-bold py-[12.4px] text-sm border-y border-second-gray w-full"
        >
          Bỏ theo dõi
        </button>
        <DialogClose asChild>
          <button
            tabIndex={0}
            type="button"
            className="text-sm py-[14px] w-full"
          >
            Hủy
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
