import Image from 'next/image';
import Link from 'next/link';

import { IPost } from '@/types/types';

type MiniUserPostsProps = {
    posts: IPost[];
};
const MiniUserPosts = ({ posts }: MiniUserPostsProps) => {
    return (
        <ul className="flex items-center gap-x-0.5 mt-4">
            {posts.length
                ? posts.map((item) => (
                      <li
                          key={item._id}
                          className="flex-1 shrink-0 size-[120px]"
                      >
                          <Link href={`/post/${item._id}`} scroll={false}>
                              {item.isReel ? (
                                  <video
                                      className="size-full  object-cover"
                                      src={item.media[0].path}
                                  ></video>
                              ) : (
                                  <figure className="size-full">
                                      <Image
                                          width={300}
                                          height={300}
                                          src={
                                              item.media[0].path ||
                                              "/images/default.jpg"
                                          }
                                          alt="mini-post-media"
                                          className="size-full object-cover "
                                      ></Image>
                                  </figure>
                              )}
                          </Link>
                      </li>
                  ))
                : null}
        </ul>
    );
};

export default MiniUserPosts;
