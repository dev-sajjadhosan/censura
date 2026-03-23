import RegisterForm from "@/components/Modules/Auth/register-form";
import AsideContent from "@/components/Shared/aside-content";

const CAROUSEL_ITEMS = [
  { id: 1, image: "/assets/carousel/movie_card_1.png", title: "AESTHETICA" },
  { id: 2, image: "/assets/carousel/movie_card_2.png", title: "CENSURA" },
  { id: 3, image: "/assets/carousel/movie_card_3_v2.png", title: "REBIRTH" },
  { id: 4, image: "/assets/carousel/movie_card_4.png", title: "THE SHADOW" },
  { id: 5, image: "/assets/carousel/movie_card_5.png", title: "ETERNITY" },
];

export default async function RegisterPage() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-5 w-full h-full">
      <RegisterForm />
      <AsideContent data={CAROUSEL_ITEMS} align="right" />
    </div>
  );
}
