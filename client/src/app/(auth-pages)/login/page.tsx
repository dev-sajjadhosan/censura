import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex items-center gap-5 w-full h-full ">
      <div className="bg-secondary/30 w-full h-full rounded-2xl"></div>
      <div className="border border-secondary/30 w-5xl h-full rounded-2xl p-20">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold">Hey there, Welcome</h1>
          <p className="text-sm text-muted-foreground">
            We are glad to see you again! Please enter your details to login and
            join with us.
          </p>
        </div>
        <div className="flex flex-col gap-3 mt-15">
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Button>Login</Button>
        </div>
        <div className="flex items-center justify-center gap-2 mt-5">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
