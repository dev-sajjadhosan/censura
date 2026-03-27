export interface ILoginResponse {
  token: string;
  refreshToken: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    needPasswordChange: boolean;
    image: string;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    phone: string;
  };
}

export interface IProfileResponse {
  _count: {
    bookmarks: number;
    favorites: number;
    watchlists: number;
    likes: number;
    reviews: number;
    comments: number;
  };
  bookmarks: Array<any>;
  favorites: Array<any>;
  watchlists: Array<any>;
  createdAt: string;
  deletedAt: string | null;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  isDeleted: boolean;
  meta: {
    bookmarks: number;
    favorites: number;
    watchlists: number;
    likes: number;
    reviews: number;
    comments: number;
  };
  name: string;
  needPasswordChange: boolean;
  profile: {
    id: string;
    userId: string;
    name: string;
    email: string;
    image: string | null;
    bio: string | null;
    coverImage: string | null;
    createdAt: string;
    updatedAt: string;
  };
  role: string;
  status: string;
  updatedAt: string;
}