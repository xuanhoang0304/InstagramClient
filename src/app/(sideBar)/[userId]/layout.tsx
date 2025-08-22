import UserHeading from '@/features/user/components/info/UserHeading';
import UserPosts from '@/features/user/components/UserPosts';

export default async function UserPageLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="flex mt-[58px] md:mt-0 pt-2 md:pt-[30px] relative md:px-5 px-3 flex-1 gap-y-10 flex-col items-center">
            <UserHeading></UserHeading>
            <UserPosts>{children}</UserPosts>
        </section>
    );
}
