import { User } from "./auth.types";
import { LikeType } from "./enum.types";
import { Media } from "./media.types";

export interface Like {
  id?: string;
  userId: string;
  mediaId: string;
  reviewId?: string;
  type: LikeType;
}

export interface Comment {
  id?: string;
  userId: string;
  user: User;
  mediaId: string;
  media: Media;
  content: string;
  createdAt: string;
}
