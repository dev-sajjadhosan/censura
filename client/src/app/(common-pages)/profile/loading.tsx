import { Loader } from "lucide-react";

export default function ProfileLoading() {
  return (
    <div className="flex items-center justify-center h-96">
      <Loader className="animate-spin size-10" />
    </div>
  );
}