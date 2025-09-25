import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { IPost } from "@/types/types";

import PostModalContent from "../../posts/postModal/PostModalContent";

interface MobileCmtDrawerProps {
  triger: React.ReactNode;
  post: IPost | null;
  onSetPosts?: (posts: IPost[]) => void;
}
const MobileCmtDrawer = ({ triger, post }: MobileCmtDrawerProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild className="md:hidden">
        {triger}
      </DrawerTrigger>
      <DrawerContent className="!mt-0 inset-0 h-full !max-h-full !bg-primary-gray pb-4 !rounded-none">
        <DrawerClose>
          <div className="bg-gray-100 mx-auto my-2 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block dark:bg-second-gray/50"></div>
        </DrawerClose>

        <DrawerHeader>
          <DrawerTitle>Bình luận của bài viết</DrawerTitle>
        </DrawerHeader>
        <PostModalContent isModal={true} item={post}></PostModalContent>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileCmtDrawer;
