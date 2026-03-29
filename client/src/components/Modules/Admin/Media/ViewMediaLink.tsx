import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "lucide-react";

export default function ViewMediaLink({
  url,
  type,
  title,
}: {
  url: string;
  title: string;
  type: "pic" | "video";
}) {
  const isNetflix = url.includes("netflix.com");
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

  const getSafeUrl = (rawUrl: string) => {
    if (isYouTube) {
      return rawUrl
        .replace("watch?v=", "embed/")
        .replace("youtu.be/", "youtube.com/embed/");
    }
    return rawUrl;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon-lg"} variant={"ghost"}>
          <Link />
        </Button>
      </DialogTrigger>
      {/* 1. Added p-0 and overflow-hidden to make the image touch the edges if needed */}
      <DialogContent className="sm:max-w-4xl bg-secondary p-0 overflow-hidden border-none">
       
          <DialogTitle className="p-0 hidden" />
         
        <div className="flex items-center justify-center w-full min-h-[300px] max-h-[85vh]">
          {type === "pic" ? (
            <img
              src={url}
              alt={title}
              /* 2. Changed h-auto to max-h-inherit and object-contain */
              className="w-full max-h-[85vh] object-contain block"
            />
          ) : isNetflix ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 space-y-4 w-full">
              <h3 className="text-xl font-bold text-white">
                Watch {title} on Netflix
              </h3>
              <p className="text-zinc-400 text-center max-w-xs">
                Netflix doesn't allow playback inside other apps.
              </p>
              <Button asChild size={"lg"}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  Open Netflix
                </a>
              </Button>
            </div>
          ) : (
            <div className="aspect-video w-full">
              <iframe
                width="100%"
                height="100%"
                src={getSafeUrl(url)}
                title={title}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
