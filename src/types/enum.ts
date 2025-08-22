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
}
export enum EMessageReaction {
    LIKE = 'LIKE',
    HAHA = 'HAHA',
    SAD = 'SAD',
    ANGRY = 'ANGRY',
    LOVE = 'LOVE',
    NORMAL = '',
  }