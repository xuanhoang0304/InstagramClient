import { Media } from '@/components/layout/SideBar/type';

import { EUserGender, IPostMedia } from './enum';

export type User = {
    name: string;
    email: string;
    phoneNumber: string;
    gender: EUserGender;
    avatar: string;
    website: string;
    bio: string;
    followers: string[];
    followings: string[];
    saved: string[];
    isReal: boolean;
} & IMongosee;

export type IPost = {
    media: Array<IPostMedia>;
    createdBy: User;
    caption: string;
    likes: string[];
    comments: string[];
    savedBy: string[];
    isReel: boolean;
    pinned: number;
} & IMongosee;
export type IComment = {
    createdBy: User;
    content: string;
    post: string;
    likes: User[];
    replies: IComment[];
    parentCommentId: string | null;
} & IMongosee;

export interface IMongosee {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface getMe {
    status: string;
    code: number;
    message: string;
    result: User;
}
export interface getExloreUser {
    result: {
        result: User[];
    };
}
export interface getExlorePost {
    result: IPost[];
}
export type HttpResponse = {
    status: string;
    code: number;
    message: string;
};
export type updatePost = {
    data: IPost;
} & HttpResponse;
export type updateUser = {
    data: User;
} & HttpResponse;
export interface TimeInterval {
    label: string;
    seconds: number;
}
export type updateComment = {
    data: IComment;
} & HttpResponse;
export type getRepleisResponse = {
    replies: IComment[];
    totalReplies: number;
};
export type CommentResponse = {
    result: IComment;
} & HttpResponse;
export type getParentCmtByPostId = {
    result: {
        comments: IComment[];
        totalComments: number;
    };
} & HttpResponse;

export type getPostsByCreated = {
    result: IPost[];
    total: number;
};
export type UploadMedia = {
    data: Media;
} & HttpResponse;
