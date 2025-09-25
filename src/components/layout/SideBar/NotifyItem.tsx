import Image from "next/image";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";
import { IComment, INotify, IPost, User } from "@/types/types";

interface Props {
  item: INotify;
}

const NotifyItem = ({ item }: Props) => {
  const NotifyMapping: Record<string, ReactNode> = {
    "like-post": (
      <>
        <div className="flex  gap-x-2">
          <figure className="size-[50px] shrink-0 rounded-full ">
            <Image
              src={item.sender.avatar || "/images/default.jpg"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full size-full object-cover"
            />
          </figure>
          <div className="font-semibold ">
            <h3 className="text-sm">{item.sender.name}</h3>
            <p className="text-xs font-normal line-clamp-2 text-second-gray">
              {item.content}
            </p>
          </div>
        </div>
        <div className="w-[60px]  shrink-0 h-auto aspect-[3/2] rounded">
          {item.target.type === "Post" &&
            ((item.target.target_id as IPost).media[0].type === "video" ? (
              <video
                src={(item.target.target_id as IPost).media[0].path}
                width={60}
                height={60}
                className="rounded object-cover size-full"
              />
            ) : (
              <Image
                src={(item.target.target_id as IPost).media[0].path}
                width={60}
                height={60}
                alt="post-image"
                className="rounded object-cover size-full"
              />
            ))}
        </div>
      </>
    ),
    "save-post": (
      <>
        <div className="flex gap-x-2">
          <figure className="size-[50px] shrink-0 rounded-full ">
            <Image
              src={item.sender.avatar || "/images/default.jpg"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full size-full object-cover"
            />
          </figure>
          <div className="font-semibold ">
            <h3 className="text-sm">{item.sender.name}</h3>
            <p className="text-xs font-normal line-clamp-2 text-second-gray">
              {item.content}
            </p>
          </div>
        </div>
        <div className="w-[60px] shrink-0 h-auto aspect-[3/2] rounded">
          {item.target.type === "Post" &&
            ((item.target.target_id as IPost).media[0].type === "video" ? (
              <video
                src={(item.target.target_id as IPost).media[0].path}
                width={60}
                height={60}
                className="rounded object-cover size-full"
              />
            ) : (
              <Image
                src={(item.target.target_id as IPost).media[0].path}
                width={60}
                height={60}
                alt="post-image"
                className="rounded object-cover size-full"
              />
            ))}
        </div>
      </>
    ),
    "follow-user": (
      <div className="flex gap-x-2 ">
        <figure className="size-[50px] shrink-0 rounded-full ">
          <Image
            src={item.sender.avatar || "/images/default.jpg"}
            alt="instagram-logo"
            width={50}
            height={50}
            className="rounded-full size-full object-cover"
          />
        </figure>
        <div className="font-semibold ">
          <h3 className="text-sm">{item.sender.name}</h3>
          <p className="text-xs font-normal line-clamp-2 text-second-gray">
            {item.content}
          </p>
        </div>
      </div>
    ),
    "comment-post": (
      <>
        <div className="flex  gap-x-2">
          <figure className="size-[50px] shrink-0 rounded-full ">
            <Image
              src={item.sender.avatar || "/images/default.jpg"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full size-full object-cover"
            />
          </figure>
          <div className="font-semibold ">
            <h3 className="text-sm">{item.sender.name}</h3>
            <p className="text-xs font-normal line-clamp-2 text-second-gray">
              {item.content}
            </p>
          </div>
        </div>
        <div className="w-[60px] shrink-0 h-auto aspect-[3/2] rounded">
          {item.target.type === "Comment" &&
            (((item.target.target_id as IComment).post as IPost).media[0]
              .type === "video" ? (
              <video
                src={
                  ((item.target.target_id as IComment).post as IPost).media[0]
                    .path
                }
                width={60}
                height={60}
                className="rounded object-cover size-full"
              />
            ) : (
              <Image
                src={(item.target.target_id as IPost).media[0].path}
                width={60}
                height={60}
                alt="post-image"
                className="rounded object-cover size-full"
              />
            ))}
        </div>
      </>
    ),
    "reply-comment": (
      <>
        <div className="flex  gap-x-2">
          <figure className="size-[50px] shrink-0 rounded-full ">
            <Image
              src={item.sender.avatar || "/images/default.jpg"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full size-full object-cover"
            />
          </figure>
          <div className="font-semibold ">
            <h3 className="text-sm">{item.sender.name}</h3>
            <p className="text-xs font-normal line-clamp-2 text-second-gray">
              {item.content}
            </p>
          </div>
        </div>
        <div className="w-[60px] shrink-0 h-auto aspect-[3/2] rounded">
          {item.target.type === "Comment" &&
            (((item.target.target_id as IComment).post as IPost).media[0]
              .type === "video" ? (
              <video
                src={
                  ((item.target.target_id as IComment).post as IPost).media[0]
                    .path
                }
                width={60}
                height={60}
                className="rounded object-cover size-full"
              />
            ) : (
              <Image
                src={(item.target.target_id as IPost).media[0].path}
                width={60}
                height={60}
                alt="post-image"
                className="rounded object-cover size-full"
              />
            ))}
        </div>
      </>
    ),
  };
  const isMobile = useMediaQuery("(max-width: 767px)");
  const router = useRouter();
  const handleClick = (item: INotify) => {
    switch (item.target.type) {
      case "Post": {
        const mbUrl = `/p/${
          (item.target.target_id as IPost).createdBy._id
        }?postId=${(item.target.target_id as IPost)._id}`;

        router.push(
          isMobile ? mbUrl : `/post/${(item.target.target_id as IPost)._id}`,
        );
        break;
      }
      case "Comment": {
        const isReplyComment = !!(item.target.target_id as IComment)
          .replyCommentId;
        const mbUrl = `/p/${
          ((item.target.target_id as IComment).post as IPost).createdBy
        }?postId=${
          ((item.target.target_id as IComment).post as IPost)._id
        }&commentId=${(item.target.target_id as IComment)._id}${
          isReplyComment
            ? `&parentId=${(item.target.target_id as IComment).parentCommentId}`
            : ""
        }`;
        router.push(
          isMobile
            ? mbUrl
            : `/post/${
                ((item.target.target_id as IComment).post as IPost)._id
              }?commentId=${(item.target.target_id as IComment)._id}${
                isReplyComment
                  ? `&parentId=${
                      (item.target.target_id as IComment).parentCommentId
                    }`
                  : ""
              }`,
        );
        break;
      }
      case "User": {
        router.push(`/${(item.target.target_id as User)._id}`);
        break;
      }
      default: {
        console.log("default");
        break;
      }
    }
  };
  return (
    <li
      onClick={() => handleClick(item)}
      className={cn(
        "flex justify-between gap-x-2 items-center cursor-pointer p-2 border-b border-primary-gray last:border-none",
        item.status === "pending" && "bg-second-button-background",
      )}
    >
      {NotifyMapping[item.type]}
    </li>
  );
};

export default NotifyItem;
