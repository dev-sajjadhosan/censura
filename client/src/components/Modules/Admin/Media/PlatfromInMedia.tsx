import { Button } from "@/components/ui/button";

import { Clapperboard, Loader2, Trash2 } from "lucide-react";
import { AnyFieldApi } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { getAllPlatforms } from "@/services/admin.service";
import { MediaPlatform, Platform } from "@/types/media.types";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function PlatfromInMedia({
  field,
  initialData,
}: {
  field: AnyFieldApi;
  initialData: MediaPlatform[];
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-platforms"],
    queryFn: () => getAllPlatforms(),
  });
  const platfroms = data?.data?.data;

  return (
    <>
      <Label htmlFor="platforms">
        Platforms Selected <Badge>{field.state.value.length}</Badge> of{" "}
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          platfroms?.length
        )}
      </Label>
      <div className="flex gap-2 flex-wrap">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs py-2">
            <Loader2 className="size-4 animate-spin" />
            Loading platforms...
          </div>
        ) : (
          platfroms?.map((p: Platform) => (
            <div key={p.id} className="flex items-center gap-1">
              <Button
                type="button"
                size={"lg"}
                variant={
                  field.state.value.includes(p.id)
                    ? "default"
                    : initialData?.some((item) => item.platform.id === p.id)
                      ? "default"
                      : "ghost"
                }
                onClick={() => {
                  if (field.state.value.includes(p.id)) {
                    field.handleChange(
                      field.state.value.filter((id: string) => id !== p.id),
                    );
                  } else {
                    field.handleChange([...field.state.value, p.id]);
                  }
                }}
              >
                <Clapperboard />
                {p.name}
              </Button>
              {field.state.value.includes(p.id) && (
                <Button
                  key={`remove-${p.id}`}
                  type="button"
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() =>
                    field.handleChange(
                      field.state.value.filter((id: string) => id !== p.id),
                    )
                  }
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
