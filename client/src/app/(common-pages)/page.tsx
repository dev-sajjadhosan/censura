import HomeClient from "@/components/Modules/Home/HomeClient";
import { getCurrentUser } from "@/services/user.service";
import { IProfileResponse } from "@/types/auth.types";


export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
    <HomeClient user={user as IProfileResponse} />
    </>
  );
}
