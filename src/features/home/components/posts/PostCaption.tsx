import { useState } from "react";

import RealUsername from "@/components/layout/RealUsername";
import { PostProp } from "@/features/home/components/posts/type";
import { cn } from "@/lib/utils";
import { User } from "@/types/types";

import ModalMiniUserProfile from "./miniUser/ModalMiniUserProfile";

type PostCaptionProps = {
  showAvt?: boolean;
} & PostProp;
const PostCaption = ({ item, showAvt }: PostCaptionProps) => {
  const [showCaption, setShowCaption] = useState(false);
  if (!item?.caption) return null;
  return (
    <div
      className={cn(
        "flex gap-x-2",
        showAvt && "sticky z-10 py-2 top-0 left-4 bg-black",
      )}
    >
      {showAvt && (
        <ModalMiniUserProfile
          user={item?.createdBy as User}
        ></ModalMiniUserProfile>
      )}

      <div
        className={cn(
          "flex gap-x-2 flex-col",
          showAvt && "text-primary-white ",
        )}
      >
        <RealUsername
          username={item?.createdBy.name}
          isReal={item?.createdBy.isReal}
        ></RealUsername>
        <h4
          className={cn(
            "text-sm italic inline-block",
            showCaption && "line-clamp-none",
          )}
        >
          {showCaption
            ? item?.caption
            : item?.caption.slice(0, 50) +
              (item?.caption && item?.caption?.length < 50 ? "" : "...")}
          {item?.caption && (
            <button
              onClick={() => setShowCaption((prev) => !prev)}
              className={cn(
                "text-sm ml-1 text-second-gray",

                item?.caption.length < 50 && "hidden",
              )}
            >
              {showCaption ? "ẩn bớt" : "xem thêm"}
            </button>
          )}
        </h4>
      </div>
    </div>
  );
};

export default PostCaption;
