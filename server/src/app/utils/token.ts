import { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";
import { Response } from "express";
import { createToken } from "./jwt";
import { setCookie } from "./cookie";


export const getAccessToken = (payload: JwtPayload) => {
  const token = createToken(payload, envVars.ACCESS_TOKEN_SECRET, {
    expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN,
  } as SignOptions);
  return token;
};

export const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    {
      expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN,
    } as SignOptions,
  );

  return refreshToken;
};

export const setAccessTokenCookie = (res: Response, token: string) => {
  setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
};

export const setBetterAuthSessionCookie = (res: Response, token: string) => {
  setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
    path: "/",
    maxAge: 60 * 60  * 24 * 1000,
  });
};
