import ChatBoxsHeading from './ChatBoxsHeading';

const ChatBoxs = () => {
    return (
        <div className="w-full max-w-[397px] pt-9 px-6 border-r border-primary-gray">
           <ChatBoxsHeading></ChatBoxsHeading>
           
            {/* Chat box */}
            <div className="flex items-center justify-between font-semibold mt-4">
                <p>Tin nhắn</p>
                <p className="text-sm text-second-gray">Tin nhắn đang chờ</p>
            </div>
            <ul className="mt-4">
                <li></li>
            </ul>
        </div>
    );
};

export default ChatBoxs;
