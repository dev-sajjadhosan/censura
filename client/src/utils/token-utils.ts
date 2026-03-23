import { setCookie } from "./cookie-utils";
import { decodeToken } from "./jwt-utils";

const getTokenSecRemaining = (token: string): number => {
  if (!token) return 0;

  try {
    const { data } = decodeToken(token);

    if (data && !data.exp) {
      return 0;
    }

    const remainingSec = (data?.exp as number) - Math.floor(Date.now() / 1000);

    return remainingSec > 0 ? remainingSec : 0;
  } catch (error: any) {
    console.log("Token error: ", error);
    return 0;
  }
};

export const setTokenInCookie = async (
  name: string,
  token: string,
  fallbackMaxAgeInSecond: number = 60 * 60 * 24, // 1 days
) => {
  let maxAgeInSec;

  if (name !== "better-auth.session_token") {
    maxAgeInSec = getTokenSecRemaining(token);
  }

  await setCookie(name, token, maxAgeInSec || fallbackMaxAgeInSecond);
};

export const isTokenExpiredSoon = async (
  token: string,
  thresholdInSeconds: number = 300,
): Promise<boolean> => {
  const remainingSec = getTokenSecRemaining(token);
  return remainingSec > 0 && remainingSec <= thresholdInSeconds;
};

export const isTokenExpired = async (token: string): Promise<boolean> => {
  const remainingSec = getTokenSecRemaining(token);
  return remainingSec === 0;
};
