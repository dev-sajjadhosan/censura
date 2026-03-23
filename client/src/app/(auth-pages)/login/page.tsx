import LoginAsideContent from "@/components/Modules/Auth/Login/login-aside-content";
import LoginForm from "@/components/Modules/Auth/Login/login-form";

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectUrl = params.redirect;
  return (
    <div className="flex items-center gap-5 w-full h-full">
      <LoginAsideContent />
      <LoginForm redirectPath={redirectUrl} />
    </div>
  );
}
