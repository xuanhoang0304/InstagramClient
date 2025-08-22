import envConfig from '@/configs/envConfig';

import { IMessageFE } from './type';

export const getTimeDifference = (time1: string, time2: string): number => {
    const date1 = new Date(time1);
    const date2 = new Date(time2);
    return Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60));
};
export const handleGroupMessages = (messages: IMessageFE[]): IMessageFE[][] => {
    if (!messages) return [];
    const groups: IMessageFE[][] = [];
    let currentGroup: IMessageFE[] = [];

    messages.forEach((message, index) => {
        if (index === 0) {
            currentGroup.push(message);
        } else {
            const prevMessage = messages[index - 1];
            const isSameSender = message.sender._id === prevMessage.sender._id;
            const timeDiff = getTimeDifference(
                String(message.createdAt),
                String(prevMessage.createdAt)
            );

            if (isSameSender && timeDiff <= envConfig.MINUTE_GROUP_MESSAGE) {
                currentGroup.push(message);
            } else {
                groups.push(currentGroup);
                currentGroup = [message];
            }
        }

        if (index === messages.length - 1) {
            groups.push(currentGroup);
        }
    });

    return groups;
};

export function scrollToMessage(messageId: string) {
    const element = document.getElementById(messageId);
    if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}
