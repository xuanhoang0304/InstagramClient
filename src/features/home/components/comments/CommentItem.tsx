import MiniUserProfile from "@/features/home/components/posts/miniUser/MiniUserProfile";
import { PostProp } from "@/features/home/components/posts/type";
import { getRelativeTime } from "@/lib/utils";
import { IComment, IPost } from "@/types/types";
import { Heart } from "lucide-react";

type CommentItemProps = {
    cmt: IComment;
    onSetPosts: (post: IPost) => void;
} & PostProp;
const CommentItem = ({ cmt, onSetPosts, item }: CommentItemProps) => {
    return (
        <li className="flex justify-between gap-x-4 ">
            <div className="flex gap-x-2 flex-1 relative">
                <MiniUserProfile
                    user={cmt.createdBy}
                    item={item}
                    onSetPosts={onSetPosts}
                ></MiniUserProfile>
                <div>
                    <p className="text-sm font-semibold max-w-[300px] line-clamp-2">
                        {cmt.createdBy.name} <span className="font-normal">{cmt.content}</span>
                    </p>
                    <div className="text-xs text-second-gray flex items-center gap-x-2">
                        <p>{getRelativeTime(String(cmt.createdAt))}</p>
                    </div>
                </div>
            </div>

            <Heart className="size-3 cursor-pointer mt-2" />
        </li>
    );
};

export default CommentItem;
