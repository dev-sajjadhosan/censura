import { useQuery } from "@tanstack/react-query";
import { getAllGenres } from "@/services/admin.service";
import { Genre } from "@/types/media.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tag, Loader2, Loader, Trash2 } from "lucide-react";
import { AnyFieldApi } from "@tanstack/react-form";

export default function GenresInMedia({
  field,
  initialData,
}: {
  field: AnyFieldApi;
  initialData: Genre[];
}) {
  const { data, isLoading: genreLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getAllGenres({ isPublished: true, page: 1, limit: 100 }),
  });
  const genres = data?.data?.data;
  return (
    <>
      <Label className="flex items-center gap-2">
        <Tag className="size-4" />
        Genres Selected <Badge>{field.state.value.length}</Badge> of{" "}
        {genreLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          genres?.length
        )}
      </Label>
      <div className="flex flex-wrap gap-2">
        {genreLoading ? (
          <div className="flex items-center gap-2 text-xs py-2">
            <Loader2 className="size-4 animate-spin" />
            Loading genres...
          </div>
        ) : (
          genres?.map((g: Genre) => (
            <div key={g.id} className="flex items-center gap-1">
              <Button
                type="button"
                size={"lg"}
                variant={
                  field.state.value.includes(g.id)
                    ? "default"
                    : initialData?.some((item) => item.id === g.id)
                      ? "default"
                      : "outline"
                }
                onClick={() => {
                  if (field.state.value.includes(g.id)) {
                    field.handleChange(
                      field.state.value.filter((id: string) => id !== g.id),
                    );
                  } else {
                    field.handleChange([...field.state.value, g.id]);
                  }
                }}
              >
                <Tag />
                {g.name}
              </Button>
              {field.state.value.includes(g.id) && (
                <Button
                  type="button"
                  size={"icon"}
                  variant={"destructive"}
                  onClick={() =>
                    field.handleChange(
                      field.state.value.filter((id: string) => id !== g.id),
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
