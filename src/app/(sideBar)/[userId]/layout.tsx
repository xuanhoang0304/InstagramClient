import UserHeading from '@/features/user/components/info/UserHeading';
import UserPosts from '@/features/user/components/UserPosts';

export default async function SideBarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div className="flex pt-[30px] relative px-5 justify-center flex-1 gap-y-10 flex-col items-center">
                <UserHeading></UserHeading>
                <UserPosts>{children}</UserPosts>
            </div>
        </>
    );
}
