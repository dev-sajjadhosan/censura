import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-3 items-center justify-center w-2xl h-full">
        <Loader className="size-9 text-orange-500 animate-spin" />
        <p className="text-lg">Verification in progress ...</p>
        <p className="text-muted-foreground">Please wait...</p>
      </div>
    </div>
  );
}