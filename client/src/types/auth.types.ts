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
