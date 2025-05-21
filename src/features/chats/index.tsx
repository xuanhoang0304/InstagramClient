import ChatBoxs from './chat boxs/ChatBoxs';

const ChatPage = () => {
    return (
        <div className="flex-1 flex">
            {/* Chat boxs */}
            <ChatBoxs></ChatBoxs>
            <div className="w-3/4">
                <div className="w-full h-12 "></div>
            </div>
        </div>
    );
};

export default ChatPage;
