import { IMessageFE } from '../type';
import MessageItem from './MessageItem';

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
                    <h3 className="text-red-500 text-sm font-semibold italic">
                        {group[0].sender.name}
                    </h3>
                )}
            </div>
        </>
    );
};

export default MessageList;
