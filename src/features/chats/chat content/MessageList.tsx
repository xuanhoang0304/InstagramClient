import { IMessageFE } from "../type";
import MessageItem from "./MessageItem";

interface Props {
  group: IMessageFE[];
  isCurUser: boolean;
  isGroup: boolean | undefined;
}
const MessageList = ({ group, isCurUser, isGroup }: Props) => {
  return (
    <>
      <div className="flex flex-col-reverse gap-y-2  w-full">
        {group.map((item) => (
          <MessageItem
            key={item._id}
            item={item}
            isCurUser={isCurUser}
            isParent
          ></MessageItem>
        ))}
        {!isCurUser && isGroup && (
          <h3 className=" text-sm font-semibold italic flex items-center gap-x-1">
            {group[0].sender.name}
            {group[0].sender.isReal && (
              <svg
                aria-label="Đã xác minh"
                className="x1lliihq x1n2onr6"
                fill="rgb(0, 149, 246)"
                height="12"
                role="img"
                viewBox="0 0 40 40"
                width="12"
              >
                <title>Đã xác minh</title>
                <path
                  d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                  fillRule="evenodd"
                ></path>
              </svg>
            )}
          </h3>
        )}
      </div>
    </>
  );
};

export default MessageList;
