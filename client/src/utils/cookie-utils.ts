import { cookies } from "next/headers";

export async function setCookie(name: string, value: string, maxAge: number) {
  return (await cookies()).set(name, value, {
    maxAge,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function getCookie(name: string) {
  return (await cookies()).get(name)?.value;
}

export async function deleteCookie(name: string) {
  return (await cookies()).delete(name);
}