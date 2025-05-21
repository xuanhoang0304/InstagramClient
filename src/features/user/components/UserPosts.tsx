"use client";
import { Contact, Film, Grid3x3 } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import UserPostsBtn from './UserPostsBtn';

const UserPosts = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname();
    const { userId } = useParams();
    return (
        <section className="max-w-[935px] mx-auto h-auto w-full min-h-[500px]">
            <div className=" w-full h-full">
                <div className="w-full h-0.5 bg-primary-gray"></div>
                <div className="flex items-center gap-x-20 mt-3 justify-center">
                    <UserPostsBtn
                        href={`/${userId}`}
                        icon={<Grid3x3 className="size-3 text-second-gray" />}
                        txt="Bài viết"
                        isActive={pathname === `/${userId}`}
                    ></UserPostsBtn>
                    <UserPostsBtn
                        href={`/${userId}/reel`}
                        icon={<Film className="size-3 text-second-gray" />}
                        txt="Reel"
                        isActive={pathname === `/${userId}/reel`}
                    ></UserPostsBtn>
                    <UserPostsBtn
                        href={`/${userId}/tagged`}
                        icon={<Contact className="size-3 text-second-gray" />}
                        txt="Được gắn thẻ"
                        isActive={pathname === `/${userId}/tagged`}
                    ></UserPostsBtn>
                </div>
                {children}
            </div>
        </section>
    );
};

export default UserPosts;
