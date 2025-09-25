import uniqBy from "lodash/uniqBy";
import { useEffect, useRef, useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import envConfig from "@/configs/envConfig";
import { useApi } from "@/hooks/useApi";
import { useMyStore } from "@/store/zustand";
import { HttpResponse, INotify } from "@/types/types";

import NotifyItem from "./NotifyItem";

interface NotifyResponse extends HttpResponse {
  result: {
    result: INotify[];
    totalResult: number;
  };
}

const NotifyList = () => {
  const { myUser } = useMyStore();
  const [listNotify, setListNotify] = useState<INotify[]>([]);
  const [pageNotify, setPageNotify] = useState(1);
  const [total, setTotal] = useState(0);
  const { data, isLoading } = useApi<NotifyResponse>(
    myUser?._id
      ? `${envConfig.BACKEND_URL}/api/notify/?filters={"recipient":"${myUser?._id}"}&page=${pageNotify}&limit=5&sort=createdAt`
      : "",
  );
  const ref = useRef<HTMLUListElement>(null);
  const handleLoadMore = () => {
    if (listNotify.length === data?.result.totalResult) {
      ref.current?.scrollTo(0, 0);
      setPageNotify(1);
      setListNotify([...listNotify].slice(0, 5));
      return;
    }

    setPageNotify((prev) => prev + 1);
  };
  useEffect(() => {
    if (data && data.result.result.length) {
      const list = data.result.result;
      setListNotify((prev) => uniqBy([...prev, ...list], "_id"));
      setTotal(data.result.totalResult);
    }
  }, [data]);
  // useEffect(() => {
  //     if (ref.current && pageNotify > 1 && !isLoading) {
  //         const timer = setTimeout(() => {
  //             if (ref.current) {
  //                 ref.current.scrollTo({
  //                     top: ref.current.scrollHeight,
  //                     behavior: "smooth",
  //                 });
  //             }
  //         }, 200);

  //         return () => clearTimeout(timer);
  //     }
  // }, [listNotify, pageNotify, isLoading]);
  useEffect(() => {
    const element = ref.current;
    if (element) {
      if (isLoading) {
        element.style.overflow = "hidden";
      } else {
        element.style.overflow = "auto";
      }
    }
    const handleScroll = () => {
      if (listNotify.length === total || isLoading) return;

      if (element && element.scrollTop) {
        const scrollBottom =
          element.scrollHeight - element.scrollTop - element.clientHeight;
        if (scrollBottom < 200) {
          console.log(`first`);
          handleLoadMore();
        }
      }
    };

    if (element) {
      element.addEventListener("scroll", handleScroll);

      return () => {
        element.removeEventListener("scroll", handleScroll);
      };
    }
  }, [ref.current, listNotify, total, isLoading]);
  if (isLoading && !listNotify.length) {
    return (
      <ul>
        {Array.from({ length: 5 * pageNotify }).map((undefined, index) => (
          <Skeleton
            key={index}
            className="h-[69px] w-full rounded-none"
          ></Skeleton>
        ))}
      </ul>
    );
  }
  if (data && !data.result.totalResult) {
    return (
      <p className="ml-2 mt-3 text-sm text-second-gray">
        Không có thông báo nào !
      </p>
    );
  }
  return (
    <ul ref={ref} className="flex flex-col  h-full overflow-y-auto pb-[80px]">
      {listNotify.map((item) => (
        <NotifyItem key={item._id} item={item}></NotifyItem>
      ))}
      {isLoading && listNotify.length && (
        <div>
          {Array.from({ length: 5 }).map((undefined, index) => (
            <Skeleton
              key={index}
              className="h-[69px] w-full rounded-none"
            ></Skeleton>
          ))}
        </div>
      )}
      <button
        className="px-3 py-2 max-w-fit mx-auto rounded-md bg-primary-blue hover:bg-second-blue transition-colors text-white text-sm mt-3"
        onClick={handleLoadMore}
      >
        <p>
          {listNotify.length === data?.result.totalResult
            ? "Ẩn bớt"
            : "Xem thêm"}
        </p>
      </button>
    </ul>
  );
};

export default NotifyList;
