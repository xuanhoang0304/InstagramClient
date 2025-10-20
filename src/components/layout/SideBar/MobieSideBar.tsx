"use client";
import { Home, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";

import MobileNotify from "../MobileNotify";
import CreatePost from "./CreatePost";

const hiddenPathName = [
  "/chats",
  "/login",
  "/register",
  "/auth/google-callback",
];
const MobieSideBar = () => {
  const { myUser } = useMyStore();
  const pathname = usePathname();
  if (hiddenPathName.some((path) => pathname.includes(path))) return null;

  const arr = [
    {
      icon: <Home className={cn(pathname === "/" && "fill-primary-white")} />,
      url: "/",
    },

    {
      icon: (
        <Search
          className={cn(pathname === "/explore" && "fill-primary-white")}
        />
      ),
      url: "/explore",
    },

    {
      icon: (
        <figure className="size-6 rounded-full">
          <Image
            src={myUser?.avatar || "/images/default.jpg"}
            alt="user-avt"
            width={50}
            height={50}
            className="size-full rounded-full object-cover"
          ></Image>
        </figure>
      ),
      url: `/${myUser?._id}`,
    },
  ];
  return (
    <ul className="flex justify-between fixed py-1.5 bottom-0 left-0  z-50 w-full bg-black  md:hidden">
      {arr.slice(0, 2).map((item) => (
        <li key={item.url} className="flex items-center justify-center">
          <Link
            href={item.url}
            className="p-3 inline-flex items-center justify-center"
          >
            {item.icon}
          </Link>
        </li>
      ))}
      <li>
        <CreatePost sideBarType={"short"}></CreatePost>
      </li>
      <li className="flex items-center justify-center">
        <button className="p-3 flex items-center justify-center relative">
          <MobileNotify></MobileNotify>
          <div className="size-2 rounded-full bg-red-500 absolute top-2 right-2"></div>
        </button>
      </li>
      {arr.slice(-1).map((item) => (
        <li key={item.url} className="flex items-center justify-center">
          <Link
            href={item.url}
            className="inline-block p-3 items-center justify-center"
          >
            {item.icon}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MobieSideBar;
