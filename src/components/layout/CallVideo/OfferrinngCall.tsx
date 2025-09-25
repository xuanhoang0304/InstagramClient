"use client";
import { Phone } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { memo } from "react";

import { IGroup } from "@/features/chats/type";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

interface IOfferringCallProps {
  groupChat: IGroup | null;
  initUser: User | null;
  onDenyCall: () => void;
  onAcceptCall: () => void;
}
const OfferrinngCall = ({
  groupChat,
  initUser,
  onDenyCall,
  onAcceptCall,
}: IOfferringCallProps) => {
  const { myUser } = useMyStore();
  const isInitCaller = String(initUser?._id) === String(myUser?._id);
  const partner = groupChat?.members.find((u) => u._id !== initUser?._id);
  return (
    <div className="text-center w-full lg:w-[70%] ">
      <h3 className="text-4xl md:text-6xl md:leading-[1.3] py-1 md:py-2 font-bold max-w-[90%] mx-auto line-clamp-2">
        {groupChat?.isGroup
          ? isInitCaller
            ? groupChat.groupName
            : `${initUser?.name} đang gọi nhóm`
          : isInitCaller
            ? partner?.name
            : initUser?.name}
      </h3>
      <figure className="rounded-full size-[120px] md:size-[180px] mx-auto mt-6 md:mt-10">
        <Image
          src={
            groupChat?.isGroup
              ? groupChat?.groupAvt || "/images/default.jpg"
              : isInitCaller
                ? partner?.avatar || "/images/default.jpg"
                : initUser?.avatar || "/images/default.jpg"
          }
          alt="group-avt"
          width={120}
          height={120}
          className="rounded-full size-full object-cover"
        ></Image>
      </figure>
      <p className="text-2xl md:text-4xl font-semibold mt-6 md:mt-10">
        {initUser?._id === String(myUser?._id) ? "Đang kết nối..." : "Đang gọi"}
      </p>
      {initUser?._id !== String(myUser?._id) && (
        <div className="flex items-center justify-between  mx-auto w-[80%] mt-[50%] md:mt-[30%]">
          <button
            onClick={onAcceptCall}
            className="relative flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: 1.4,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              exit={{
                scale: 0.7,
              }}
              className="size-[80px] md:size-[120px] absolute inset-0 bg-green-400/30 flex items-center justify-center rounded-full"
            ></motion.div>
            <motion.figure
              animate={{
                rotate: -20,
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="size-[80px] md:size-[120px] relative bg-green-500 rounded-full flex items-center justify-center z-20"
            >
              <Phone className="fill-white size-8 md:size-12" />
            </motion.figure>
          </button>
          <button
            onClick={onDenyCall}
            className="relative flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 1 }}
              animate={{
                scale: 1.4,
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              exit={{
                scale: 0.7,
              }}
              className="size-[80px] md:size-[120px] absolute inset-0 bg-red-400/30 flex items-center justify-center rounded-full"
            ></motion.div>
            <motion.figure
              animate={{
                rotate: -20,
                transition: {
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
              className="size-[80px] md:size-[120px] relative bg-red-500 rounded-full flex items-center justify-center z-20"
            >
              <Phone className="fill-white size-8 md:size-12 " />
            </motion.figure>
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(OfferrinngCall);
