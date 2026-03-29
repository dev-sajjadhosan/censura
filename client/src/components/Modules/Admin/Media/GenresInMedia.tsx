import { useQuery } from "@tanstack/react-query";
import { adminGetAllGenres } from "@/services/admin.service";
import { Genre } from "@/types/media.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tag, Loader2, Loader } from "lucide-react";
import { AnyFieldApi } from "@tanstack/react-form";

export default function GenresInMedia({ field }: { field: AnyFieldApi }) {
  const { data, isLoading: genreLoading } = useQuery({
    queryKey: ["genres"],
    queryFn: () =>
      adminGetAllGenres({ isPublished: true, page: 1, limit: 100 }),
  });
  const genres = data?.data.data;

  console.log("all admin genres: ", data?.data.data);
  return (
    <>
      <Label className="flex items-center gap-2">
        <Tag className="size-4" />
        Genres
        <Badge>
          {genreLoading ? <Loader2 className="animate-spin" /> : genres?.length}
        </Badge>
      </Label>
      <div className="flex flex-wrap gap-2">
        {genreLoading ? (
          <div className="flex items-center gap-2 text-xs py-2">
            <Loader2 className="size-4 animate-spin" />
            Loading genres...
          </div>
        ) : (
          genres?.map((g: Genre) => (
            <Button
              key={g.id}
              type="button"
              size={"lg"}
              variant={field.state.value.includes(g.id) ? "default" : "ghost"}
              onClick={() => field.handleChange([...field.state.value, g.id])}
            >
              <Tag />
              {g.name}
            </Button>
          ))
        )}
      </div>
    </>
  );
}
