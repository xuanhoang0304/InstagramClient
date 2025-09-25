"use client";
import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";

import { useRepliesStore } from "@/store/repliesStore";
import { useMyStore } from "@/store/zustand";

type PostModalProps = {
  Content: ReactNode;
  className?: string;
  onCloseModal: () => void;
};
const PostModal = ({ Content, onCloseModal }: PostModalProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const { resetReplies } = useRepliesStore();
  const { settargetCmt } = useMyStore();

  const handleClickOutside = () => {
    settargetCmt(null);
    resetReplies();
    onCloseModal();
  };

  useOnClickOutside(ref as React.RefObject<HTMLElement>, handleClickOutside);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-black/60 fixed flex items-center justify-center inset-0 z-[49]"
      >
        <div
          ref={ref}
          className=" flex lg:max-h-full lg:max-w-fit border-second-gray border w-[80%] justify-center rounded-lg"
        >
          {Content}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostModal;
