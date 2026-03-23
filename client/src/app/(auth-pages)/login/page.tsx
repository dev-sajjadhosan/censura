import LoginForm from "@/components/Modules/Auth/login-form";
import AsideContent from "@/components/Shared/aside-content";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

const CAROUSEL_ITEMS = [
  { id: 1, image: "/assets/carousel/movie_card_1.png", title: "AESTHETICA" },
  { id: 2, image: "/assets/carousel/movie_card_2.png", title: "CENSURA" },
  { id: 3, image: "/assets/carousel/movie_card_3_v2.png", title: "REBIRTH" },
  { id: 4, image: "/assets/carousel/movie_card_4.png", title: "THE SHADOW" },
  { id: 5, image: "/assets/carousel/movie_card_5.png", title: "ETERNITY" },
];

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectUrl = params.redirect;
  return (
    <div className="flex flex-col lg:flex-row items-center gap-5 w-full h-full">
      <AsideContent data={CAROUSEL_ITEMS} />
      <LoginForm redirectPath={redirectUrl} />
    </div>
  );
}
