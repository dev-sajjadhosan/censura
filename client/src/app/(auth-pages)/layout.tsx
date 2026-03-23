import { Button } from "@/components/ui/button";
import { Home, Settings } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen w-full items-center">
      <div className="flex items-center justify-between w-9/12 py-2">
        <Button variant="ghost" size={"xl"}>
          <Home />
        </Button>
        <h1 className="text-xl font-sans">Censura</h1>
        <Button variant="ghost" size={"xl"}>
          <Settings />
        </Button>
      </div>
      <div className="p-5 w-full h-full">
        <div className="flex items-center justify-center w-full h-full rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
