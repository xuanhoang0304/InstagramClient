import dayjs from "dayjs";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";
import { useMyStore } from "@/store/zustand";

import { IGroup, IMessageFE, IMessageResponse } from "../../../type";

type Props = {
  group: IGroup;
  onSetStep: (step: string) => void;
};

const GroupChatFindMsgWrapper = ({ onSetStep, group }: Props) => {
  const { myUser } = useMyStore();
  const [listMsg, setListMsg] = useState<IMessageFE[]>([]);
  const [searchTxt, setSearchTxt] = useState("");
  const debounceSearchText = useDebounce(searchTxt, 300);
  const { data } = useApi<IMessageResponse>(
    debounceSearchText
      ? `chats/?filters={"text": "${debounceSearchText}", "groupId": "${group._id}"}&page=1&limit=10`
      : "",
  );
  const router = useRouter();
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTxt(e.target.value);
    },
    [searchTxt],
  );
  const handleMoveToChat = (msgId: string) => {
    router.push(`/chats/${group._id}?msgId=${msgId}`);
    onSetStep("");
  };

  useEffect(() => {
    if (data) {
      setListMsg(data.result.result);
    }
    if (!debounceSearchText) {
      setListMsg([]);
    }
  }, [debounceSearchText, data]);
  return (
    <div className="size-full">
      <div className="GroupChatFindMsgWrapper-header flex items-center gap-x-3 p-4 sticky top-0 z-10 bg-primary-gray">
        <button onClick={() => onSetStep("")}>
          <MoveLeft />
        </button>
        <p className="font-semibold">Tìm kiếm</p>
      </div>
      <div className="px-4">
        <Input
          name="find-msg-input"
          placeholder="Nhập nội dung cần tìm..."
          value={searchTxt}
          onChange={handleChange}
        ></Input>
      </div>
      {!!data?.result.totalResult && (
        <p className="ml-4 mt-3 text-sm font-semibold text-second-gray">
          Tìm thấy{" "}
          <span className="text-primary-blue">{data.result.totalResult}</span>{" "}
          tin nhắn phù hợp
        </p>
      )}
      {listMsg.length ? (
        <ul className="py-4 flex flex-col">
          {listMsg.map((item) => {
            const restContent = item.text.slice(debounceSearchText.length);
            return (
              <li
                key={item._id}
                className="flex items-center gap-x-4 px-4 py-2  cursor-pointer hover:bg-second-button-background transition-colors"
                onClick={() => handleMoveToChat(item._id)}
              >
                <figure className="size-10 shrink-0">
                  <Image
                    src={item.sender.avatar || "/images/default.jpg"}
                    alt="sender avt"
                    width={50}
                    height={50}
                    className="size-full object-cover rounded-full"
                  ></Image>
                </figure>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">
                    {String(myUser?._id) === item.sender._id
                      ? "Bạn"
                      : item.sender.name}
                  </h3>
                  <div className="flex items-center gap-x-2 mt-0.5 ">
                    <p className="text-xs line-clamp-1 max-w-[200px] wrap-break-word text-second-gray italic">
                      <span className="text-primary-white">
                        {debounceSearchText}
                      </span>
                      {restContent}
                    </p>
                    <span className="text-xs text-second-gray">
                      {dayjs(item.createdAt).format("DD/MM/YYYY-HH:mm")}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      ) : debounceSearchText ? (
        <p className="text-xs text-second-gray text-center mt-4">
          Không tìm thấy tin nhắn phù hợp
        </p>
      ) : null}
    </div>
  );
};

export default memo(GroupChatFindMsgWrapper);
