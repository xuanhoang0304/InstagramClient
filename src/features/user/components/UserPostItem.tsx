import { Heart, MessageCircle, Pin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { IPost } from '@/types/types';

type UserPostItemProps = {
    post: IPost;
};
const UserPostItem = ({ post }: UserPostItemProps) => {
    return (
        <>
            <li className="group">
                <Link href={`/post/${post._id}`} className="relative">
                    {post.pinned ? (
                        <Pin className="fill-red-500 text-red-500 size-5 rotate-45 absolute right-3 top-3"></Pin>
                    ) : null}
                    {!post.isReel ? (
                        <figure className="w-full h-[410px]">
                            <Image
                                src={post.media[0].path}
                                alt={`post-${post._id}-img`}
                                width={600}
                                height={800}
                                className="size-full object-cover"
                            ></Image>
                        </figure>
                    ) : (
                        <video
                            className="w-full h-[410px] object-cover"
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
