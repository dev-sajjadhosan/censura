import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type AppSubmitButtonProps = {
  isPending: boolean;
  pendingLabel?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function AppSubmitButton({
  isPending,
  pendingLabel = "Submitting...",
  children,
  className,
  disabled = false,
}: AppSubmitButtonProps) {
  const isDisabled = disabled || isPending;
  return (
    <Button
      type="submit"
      disabled={isDisabled}
      size={"xl"}
      className={cn("w-full", className)}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLabel ? pendingLabel : children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
