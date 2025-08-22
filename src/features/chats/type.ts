import { Media } from '@/components/layout/SideBar/type';
import { HttpResponse, IMongosee, User } from '@/types/types';

export interface IGroup extends IMongosee {
    members: User[];
    isGroup: boolean;
    createdBy: User;
    groupAvt: string;
    groupAdmin: string[];
    lastMessage: string | null;
    groupName: string;
    _id: string;
}
export interface IMessageFE extends IMongosee {
    _id: string;
    groupId: string;
    text: string;
    images: Media[];
    videos: Media[];
    replies: User[];
    seenBy: User[];
    sender: User;
    reaction: string | "";
    parentMessage: IMessageFE | null;
}
export interface IGroupResponse extends HttpResponse {
    data: IGroup;
    result?: IGroup;
}
export interface IMessageResponse extends HttpResponse {
    result: {
        result: IMessageFE[];
        totalResult: number;
    };
    data?: IMessageFE;
}
