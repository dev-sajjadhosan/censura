
import { axiosClient } from "@/lib/axiosClient";

export const getCurrentUser = async () => {
  try {
    const res = await axiosClient.get("/auth/me");

    console.log("getCurrentUser", res.data);

    return res.data;
  } catch (error: any) {
    console.log(error);
  }
};
