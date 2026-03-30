import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

export const TooltipButton = ({
  children = (
    <Button size={"icon"} variant={"ghost"}>
      <Sparkles />
    </Button>
  ),
  tooltip = "Set Tooltip Text",
  side,
  align,
}: {
  children: React.ReactNode;
  tooltip: string;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
