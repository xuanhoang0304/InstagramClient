import { User } from "@/types/types";

export type Media = {
  name?: string;
  isValid?: boolean;
  type: "video" | "image";
  path: string;
  thumbnailUrl?: string;
  sender?: User;
  messageId?: string;
  createdAt?: string;
};
