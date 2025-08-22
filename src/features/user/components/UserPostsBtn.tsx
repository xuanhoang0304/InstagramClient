import Link from 'next/link';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type UserPostsBtnProps = {
    txt: string;
    href: string;
    icon: ReactNode;
    isActive: boolean;
};
const UserPostsBtn = ({ txt, icon, href, isActive }: UserPostsBtnProps) => {
    return (
        <>
            <Link
                href={href}
                prefetch
                className="flex items-center gap-x-2 relative flex-1 justify-center h-6"
            >
                {icon}
                <p className={cn("text-second-gray text-sm font-semibold hidden md:block")}>
                    {txt.toLocaleUpperCase()}
                </p>
                {isActive && (
                    <div className="absolute md:top-[-14px] bottom-[-14px] left-0 w-full md:h-0.5 h-[1px] bg-primary-white rounded-full"></div>
                )}
            </Link>
        </>
    );
};

export default UserPostsBtn;
