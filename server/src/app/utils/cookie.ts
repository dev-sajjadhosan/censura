import { CookieOptions, Request, Response } from "express";

export const setCookie = (
  res: Response,
  key: string,
  value: string,
  options: CookieOptions,
) => {
  res.cookie(key, value, options);
};

export const getCookie = (req: Request, key: string) => {
  return req.cookies[key];
};

export const clearCookie = (res: Response, key: string, options: CookieOptions) => {
  res.clearCookie(key, options);
};

