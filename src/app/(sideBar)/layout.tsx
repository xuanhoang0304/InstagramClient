import "../globals.css";

import SideBar from "@/components/layout/SideBar/SideBar";

export default async function SideBarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen md:min-h-auto">
      <SideBar type="normal"></SideBar>
      {children}
    </main>
  );
}
