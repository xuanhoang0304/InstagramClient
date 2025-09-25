import { Heart } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import NotifyList from "./SideBar/NotifyList";

const MobileNotify = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Heart className="size-7" />
      </DrawerTrigger>
      <DrawerContent className="!bg-primary-gray !rounded-none  !h-[100vh] !max-h-full !mt-0">
        <DrawerHeader className="relative">
          <DrawerTitle className="text-2xl font-bold">Thông báo</DrawerTitle>
        </DrawerHeader>
        <NotifyList></NotifyList>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNotify;
