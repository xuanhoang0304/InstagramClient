import '../globals.css';

export default async function NoSideBarLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <main className='px-2'>{children}</main>;
}
