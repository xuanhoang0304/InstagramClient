import { Media } from "@/components/layout/SideBar/type";

import {
  ENotifyStatus,
  ENotifyType,
  ETargetType,
  EUserGender,
  IPostMedia,
} from "./enum";

export interface IMongosee {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface INotifyTarget {
  type: ETargetType;
  target_id: IComment | User | IPost | string;
}
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
  name_normailized: string;
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
  post: string | IPost;
  likes: User[];
  replies: IComment[];
  parentCommentId: string | null;
  replyCommentId: IComment | string | null;
} & IMongosee;
export interface INotify extends IMongosee {
  sender: User;
  recipient: User;
  content: string;
  title: string;
  type: ENotifyType;
  status: ENotifyStatus;
  target: INotifyTarget;
}

export interface getMe {
  status: string;
  code: number;
  message: string;
  result: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
export interface getExloreUser {
  result: {
    result: User[];
  };
}
export interface getExlorePost {
  result: IPost[];
  total: number;
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
