import RealUsername from "@/components/layout/RealUsername";

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
      <div className="group-item flex flex-col-reverse gap-y-2 w-full">
        {group.map((item) => {
          return (
            <MessageItem
              key={item._id}
              item={item}
              isCurUser={isCurUser}
              isParent
            ></MessageItem>
          );
        })}
        {!isCurUser && isGroup && (
          <RealUsername
            username={group[0].sender.name}
            isReal={group[0].sender.isReal}
          ></RealUsername>
        )}
      </div>
    </>
  );
};

export default MessageList;
