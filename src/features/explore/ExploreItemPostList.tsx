import { cn } from "@/lib/utils";
import { IPost } from "@/types/types";

import UserPostItem from "../user/components/UserPostItem";

interface Props {
  item: IPost[];
  idx: number;
}
const ExploreItemPostList = ({ item, idx }: Props) => {
  return (
    <ul
      className={cn(
        "flex items-center gap-0.5 h-full mx-auto",
        idx % 2 === 0 ? "" : "flex-row-reverse",
      )}
    >
      <div className=" h-full flex-1/3">
        <UserPostItem
          post={item[0]}
          imageWrapClass="aspect-[1/2] h-full"
          videoClass="!aspect-[1/2] h-full"
        ></UserPostItem>
      </div>
      <div className=" flex-2/3 grid grid-cols-2 gap-0.5 h-full">
        {item.slice(1).map((post) => (
          <UserPostItem
            key={post._id}
            post={post}
            imageWrapClass="!aspect-square h-full"
            videoClass="!aspect-square h-full"
            className="h-auto !aspect-square"
          ></UserPostItem>
        ))}
      </div>
    </ul>
  );
};

export default ExploreItemPostList;
