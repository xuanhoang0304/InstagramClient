"use client";
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

import { socket } from '@/configs/socket';
import { PUBLIC_ROUTES } from '@/lib/utils';

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    useEffect(() => {
        if (PUBLIC_ROUTES.includes(pathname)) return;
        socket.connect();
        socket.on("connect", () => {});
        socket.on("disconnect", () => {});
        return () => {
            socket.disconnect();
        };
    }, []);
    return <>{children}</>;
};

export default SocketProvider;
