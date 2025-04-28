import { CommentInput } from "@/features/home/components/comments/CommentInput";
import CommentList from "@/features/home/components/comments/CommentList";
import PostButtons from "@/features/home/components/posts/PostButtons";
import PostItemHeading from "@/features/home/components/posts/PostItemHeading";
import PostItemMedia from "@/features/home/components/posts/PostItemMedia";
import { PostProp } from "@/features/home/components/posts/type";
import { IPost } from "@/types/types";
type PostModalContentProps = {
    onSetPosts: (post: IPost) => void;
} & PostProp;
const PostModalContent = ({ item, onSetPosts }: PostModalContentProps) => {
    return (
        <>
            <PostItemMedia
                className="max-w-[468px] h-auto rounded-none"
                item={item}
                figureClassName="rounded-none h-full"
                imageClassName="rounded-none block h-full"
                videoClassName="m-0 border-none rounded-none bg-black "
            ></PostItemMedia>
            <div className=" w-[485px] h-auto bg-black">
                <PostItemHeading
                    isShowTime={false}
                    item={item}
                    onSetPosts={onSetPosts}
                    className="p-4  relative z-[11]"
                ></PostItemHeading>
               
                <CommentList item={item} onSetPosts={onSetPosts}></CommentList>
                <div className="w-full  relative z-[9] p-2">
                    <PostButtons
                        item={item}
                        onSetPosts={onSetPosts}
                    ></PostButtons>
                    <CommentInput></CommentInput>
                </div>
            </div>
        </>
    );
};

export default PostModalContent;
