import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

async function tryRefreshToken(accessToken: string, refreshToken: string):Promise<void> {
    
}

const axiosInstance = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if(accessToken && refreshToken){
        // await tryRefreshToken(accessToken, refreshToken)


        // ... lets start from here next_time
    }
    
}