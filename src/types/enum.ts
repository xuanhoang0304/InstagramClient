export enum EUserGender {
  Male = "male",
  Female = "female",
  NA = "N/A",
}
export enum EPostMediaType {
  Image = "image",
  Video = "video",
}
export interface IPostMedia {
  type: EPostMediaType;
  path: string;
  thumbnailUrl?: string;
}
export enum EMessageReaction {
  LIKE = "LIKE",
  HAHA = "HAHA",
  SAD = "SAD",
  ANGRY = "ANGRY",
  LOVE = "LOVE",
  NORMAL = "",
}
export enum ENotifyType {
  likePost = "like-post",
  commentPost = "comment-post",
  followUser = "follow-user",
  replyComment = "reply-comment",
  savePost = "save-post",
  system = "system",
}
export enum ENotifyStatus {
  pending = "pending",
  read = "read",
  deleted = "deleted",
}
export enum ETargetType {
  Post = "Post",
  Comment = "Comment",
  User = "User",
}
