import '../globals.css';

import SideBar from '../../components/layout/SideBar/SideBar';

export default async function SideBarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex">
            <SideBar></SideBar>
            {children}
        </main>
    );
}
