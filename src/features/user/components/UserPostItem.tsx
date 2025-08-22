import { Heart, MessageCircle, Pin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMediaQuery } from 'usehooks-ts';

import { cn } from '@/lib/utils';
import { IPost } from '@/types/types';

type UserPostItemProps = {
    post: IPost;
    imageWrapClass?: string;
    imageClass?: string;
    videoClass?: string;
    className?: string;
};
const UserPostItem = ({
    post,
    imageClass,
    imageWrapClass,
    videoClass,
    className,
}: UserPostItemProps) => {
    const isMobile = useMediaQuery("(max-width: 767px)");
    return (
        <>
            <li className={cn("group h-full ", className)}>
                <Link
                    href={
                        isMobile
                            ? `/p/${post.createdBy._id}?postId=${post._id}`
                            : `/post/${post._id}`
                    }
                    className="relative block h-full"
                >
                    {post.pinned ? (
                        <Pin className="fill-red-500 text-red-500 size-5 rotate-45 absolute right-3 top-3"></Pin>
                    ) : null}
                    {!post.isReel ? (
                        <figure
                            className={cn(
                                "w-full aspect-square",
                                imageWrapClass
                            )}
                        >
                            <Image
                                src={post.media[0].path}
                                alt={`post-${post._id}-img`}
                                width={600}
                                height={800}
                                className={cn(
                                    "size-full object-cover",
                                    imageClass
                                )}
                            ></Image>
                        </figure>
                    ) : (
                        <video
                            className={cn(
                                "w-full md:aspect-[3/4] aspect-square object-cover",
                                videoClass
                            )}
                            src={post.media[0].path}
                        ></video>
                    )}
                    <div className="absolute top-0 left-0 w-full h-full bg-black/50 hidden z-10  group-hover:flex items-center justify-center">
                        <div className="flex items-center gap-x-8">
                            <div className="flex items-center gap-x-2 text-primary-white">
                                <Heart className="fill-primary-white size-5"></Heart>
                                <p className="text-base font-bold">
                                    {post.likes.length}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2 text-primary-white">
                                <MessageCircle className="fill-primary-white size-5 -rotate-90"></MessageCircle>
                                <p className="text-base font-bold">
                                    {post.comments.length}
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>
            </li>
        </>
    );
};

export default UserPostItem;
