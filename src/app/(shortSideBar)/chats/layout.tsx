import SideBar from "@/components/layout/SideBar/SideBar";
import ChatBoxs from "@/features/chat/chat boxs/ChatBoxs";

export default async function ShortSideBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex w-full">
      <SideBar type="short"></SideBar>
      <div className="flex-1 flex flex-col lg:flex-row w-full h-dvh overflow-y-hidden">
        {/* Chat boxs */}
        <ChatBoxs></ChatBoxs>
        {children}
      </div>
    </main>
  );
}
