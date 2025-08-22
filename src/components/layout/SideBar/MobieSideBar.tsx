"use client";
import { Heart, Home, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';

import CreatePost from './CreatePost';

const hiddenPathName = ["/chats", "/login", "/register"];
const MobieSideBar = () => {
    const { myUser } = useMyStore();
    const pathname = usePathname();
    if (hiddenPathName.some(path => pathname.startsWith(path))) return null;

    const arr = [
        {
            icon: (
                <Home
                    className={cn(pathname === "/" && "fill-primary-white")}
                />
            ),
            url: "/",
        },

        {
            icon: (
                <Search
                    className={cn(
                        pathname === "/explore" && "fill-primary-white"
                    )}
                />
            ),
            url: "/explore",
        },

        {
            icon: (
                <Heart
                    className={cn(
                        pathname === "/notifications" && "fill-primary-white"
                    )}
                />
            ),
            url: "/notifications",
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
        <ul className="flex justify-evenly py-2 fixed border-t border-primary-gray bottom-0 left-0 h-[60px] z-50 w-full bg-black  md:hidden">
            {arr.slice(0, 2).map((item) => (
                <li
                    key={item.url}
                    className="flex items-center justify-center w-11"
                >
                    <Link
                        href={item.url}
                        className="size-full flex items-center justify-center"
                    >
                        {item.icon}
                    </Link>
                </li>
            ))}
            <li>
                <CreatePost sideBarType={"short"}></CreatePost>
            </li>
            {arr.slice(2).map((item) => (
                <li
                    key={item.url}
                    className="flex items-center justify-center w-11"
                >
                    <Link
                        href={item.url}
                        className="size-full flex items-center justify-center"
                    >
                        {item.icon}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default MobieSideBar;
