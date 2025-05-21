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
                className="flex items-center gap-x-2 relative"
            >
                {icon}
                <p className={cn("text-second-gray text-sm font-semibold")}>
                    {txt.toLocaleUpperCase()}
                </p>
                {isActive && (
                    <div className="absolute top-[-14px] left-0 w-full h-0.5 bg-primary-white rounded-full"></div>
                )}
            </Link>
        </>
    );
};

export default UserPostsBtn;
