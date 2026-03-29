import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Platform } from "@/types/media.types";
import { Clapperboard, Link2 } from "lucide-react";
import Link from "next/link";

interface DialogShowPlatformsProps {
  platforms: Platform[];
  title: React.ReactNode;
}

export default function DialogShowPlatforms({
  platforms = [],
  title,
}: DialogShowPlatformsProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger>{title}</DialogTrigger>
        <DialogContent className="sm:min-w-3xl p-10">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Available Platforms{" "}
            <Badge variant="secondary">{platforms.length}</Badge>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {platforms?.map((p: Platform) => (
              <div
                key={p.id}
                className="bg-secondary/15 hover:bg-secondary/65 px-4 py-4 flex items-center gap-3 rounded-xl"
              >
                <Clapperboard className="size-5 text-orange-500" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {p.type}
                  </span>
                </div>
                <Link href={p.url || "#"} target="_blank" className="ml-auto">
                  <Button variant="ghost" size="icon">
                    <Link2 />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
