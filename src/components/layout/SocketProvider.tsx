"use client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { toast } from "sonner";

import { socket } from "@/configs/socket";
import { PUBLIC_ROUTES } from "@/lib/utils";
import { IPost, User } from "@/types/types";

interface ActionMapping {
  render: (data: NotifyResult["data"]) => ReactNode;
  action?: (data: NotifyResult["data"]) => void;
}
interface NotifyResult {
  type: string | ActionMapping;
  data: {
    sender: User;
    message: string;
    post?: IPost;
  };
}
const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const NotifyMapping: Record<string, ActionMapping> = {
    "like-post": {
      render: (data: NotifyResult["data"]) => (
        <>
          <div className="flex  gap-x-2">
            <Image
              src={"https://cdn-icons-png.freepik.com/512/4138/4138124.png"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="font-semibold text-primary-gray">
              <h3 className="text-sm">Instagram</h3>
              <p className="text-xs font-normal line-clamp-2">{data.message}</p>
            </div>
          </div>
          <div
            onClick={() => {
              if (data.post?._id) {
                router.push(`/post/${data.post._id}`);
              }
            }}
            className="w-[60px] shrink-0 h-10 rounded-md"
          >
            {data.post?.media[0] &&
              (data.post.media[0].type === "video" ? (
                <video
                  src={data.post.media[0].path}
                  width={60}
                  height={60}
                  className="rounded-md object-cover size-full"
                />
              ) : (
                <Image
                  src={data.post.media[0].path}
                  width={60}
                  height={60}
                  alt="post-image"
                  className="rounded-md object-cover size-full"
                />
              ))}
          </div>
        </>
      ),
    },
    "save-post": {
      render: (data: NotifyResult["data"]) => (
        <>
          <div className="flex gap-x-2">
            <Image
              src={"https://cdn-icons-png.freepik.com/512/4138/4138124.png"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="font-semibold text-primary-gray">
              <h3 className="text-sm">Instagram</h3>
              <p className="text-xs font-normal line-clamp-2">{data.message}</p>
            </div>
          </div>
          <div
            onClick={() => {
              if (data.post?._id) {
                router.push(`/post/${data.post._id}`);
              }
            }}
            className="w-[60px] shrink-0 h-10 rounded-md"
          >
            {data.post?.media[0] &&
              (data.post.media[0].type === "video" ? (
                <video
                  src={data.post.media[0].path}
                  width={60}
                  height={60}
                  className="rounded-md object-cover size-full"
                />
              ) : (
                <Image
                  src={data.post.media[0].path}
                  width={60}
                  height={60}
                  alt="post-image"
                  className="rounded-md object-cover size-full"
                />
              ))}
          </div>
        </>
      ),
    },
    "follow-user": {
      render: (data: NotifyResult["data"]) => (
        <>
          <div className="flex gap-x-2 ">
            <Image
              src={"https://cdn-icons-png.freepik.com/512/4138/4138124.png"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="font-semibold text-primary-gray">
              <h3 className="text-sm">Instagram</h3>
              <p className="text-xs font-normal line-clamp-2">{data.message}</p>
            </div>
          </div>
          <figure
            onClick={() => {
              if (data.sender?._id) {
                router.push(`/${data.sender._id}`);
              }
            }}
            className="size-[50px] shrink-0 rounded-full "
          >
            <Image
              src={data.sender.avatar || "/images/default.jpg"}
              alt="user-follow-logo"
              width={50}
              height={50}
              className="rounded-full size-full object-cover"
            />
          </figure>
        </>
      ),
    },
    "comment-post": {
      render: (data: NotifyResult["data"]) => (
        <>
          <div className="flex  gap-x-2">
            <Image
              src={"https://cdn-icons-png.freepik.com/512/4138/4138124.png"}
              alt="instagram-logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="font-semibold text-primary-gray">
              <h3 className="text-sm">Instagram</h3>
              <p className="text-xs font-normal line-clamp-2">{data.message}</p>
            </div>
          </div>
          <div
            onClick={() => {
              if (data.post?._id) {
                router.push(`/post/${data.post._id}`);
              }
            }}
            className="w-[60px] shrink-0 h-10 rounded-md"
          >
            {data.post?.media[0] &&
              (data.post.media[0].type === "video" ? (
                <video
                  src={data.post.media[0].path}
                  width={60}
                  height={60}
                  className="rounded-md object-cover size-full"
                />
              ) : (
                <Image
                  src={data.post.media[0].path}
                  width={60}
                  height={60}
                  alt="post-image"
                  className="rounded-md object-cover size-full"
                />
              ))}
          </div>
        </>
      ),
    },
  };

  useEffect(() => {
    const handleNotify = (result: NotifyResult) => {
      if (PUBLIC_ROUTES.includes(pathname) || pathname.includes("/chats"))
        return;
      const { type, data } = result;
      const handler = NotifyMapping[type as keyof typeof NotifyMapping];
      toast.custom(
        (t) => (
          <div
            onClick={() => {
              if (handler.action) {
                handler.action(data);
              }
              toast.dismiss(t);
            }}
            className="md:min-w-[400px] cursor-pointer p-3 rounded-xl flex items-center justify-between gap-x-4 border border-gray-300 bg-white shadow-lg animate-in slide-in-from-bottom-5"
          >
            {handler.render(data)}
          </div>
        ),
        {
          duration: 5000,
        },
      );
    };
    socket.on("notify", handleNotify);
    return () => {
      socket.off("notify", handleNotify);
    };
  }, [router, pathname]);
  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;
    socket.connect();
    socket.on("connect", () => {});
    socket.on("disconnect", () => {});
    return () => {
      socket.disconnect();
    };
  }, []);
  return <>{children}</>;
};

export default SocketProvider;
