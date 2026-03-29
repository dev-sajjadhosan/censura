"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Cast } from "@/types/media.types";
import { createGenreSchema } from "@/zod/genre.validation";
import { createCastValidationSchema } from "@/zod/media.validation";
import { useForm } from "@tanstack/react-form";
import { Loader2, PlusCircle, UserPlus2 } from "lucide-react";
import { useState } from "react";

export default function CastInMediaDialog({
  cast,
  setCast,
}: {
  cast: Cast[];
  setCast: (cast: Cast[]) => void;
}) {
  const [image, setImage] = useState<File | string | undefined>(undefined);
  const form = useForm({
    defaultValues: {
      name: "",
      role: "",
      image: "",
    },
    onSubmit: async ({ value }) => {
      setCast([...cast, value]);
      form.reset();
      setImage(undefined);
    },
  });

  return (
    <>
      <div className="flex flex-wrap gap-5">
        {cast.length === 0 && (
          <div className="flex items-center gap-2 py-3 mx-auto">
            <UserPlus2 className="size-5" />
            <p className="text-muted-foreground">No cast added yet!</p>
          </div>
        )}
        {cast.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-secondary/35 px-3 py-2 rounded-lg"
          >
            <Avatar>
              <AvatarImage src={c?.image || "https://github.com/shadcn.png"} />
              <AvatarFallback>{c?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Separator orientation="vertical" className="h-5! my-auto" />
            <div className="flex flex-col">
              <h3 className="text-sm font-medium">{c?.name}</h3>
              <p className="text-xs text-muted-foreground">{c?.role}</p>
            </div>
          </div>
        ))}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size={"lg"}>
            <UserPlus2 /> Add Cast
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-secondary sm:max-w-3xl p-9 ">
          <DialogHeader>
            <DialogTitle>Add new cast</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            noValidate
            className="flex flex-col gap-3 mt-5"
          >
            <div className="flex items-end gap-7 w-full mb-3">
              <Avatar className="size-25">
                <AvatarImage src={image || "https://github.com/shadcn.png"} />
                <AvatarFallback>
                  {form.state.values.name.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <form.Field
                name="image"
                validators={{
                  onChange: createCastValidationSchema.shape.image,
                }}
                children={(field) => {
                  return (
                    <div className="flex flex-col gap-2 w-full">
                      <Label htmlFor={field.name}>Cast Image</Label>
                      <Input
                        value={field.state.value}
                        onChange={(e) => {
                          field.handleChange(e.target.value);
                          setImage(e.target.value);
                        }}
                        placeholder="Cast Image"
                        className="bg-background/45"
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-xs text-red-500">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </div>
                  );
                }}
              />
            </div>

            <form.Field
              name="name"
              validators={{
                onChange: createCastValidationSchema.shape.name,
              }}
              children={(field) => {
                return (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Cast Name</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Cast Name"
                      className="bg-background/45"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />
            <form.Field
              name="role"
              validators={{
                onChange: createCastValidationSchema.shape.role,
              }}
              children={(field) => {
                return (
                  <div className="flex flex-col gap-2">
                    <Label htmlFor={field.name}>Cast Role</Label>
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Cast Role"
                      className="bg-background/45"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </div>
                );
              }}
            />

            <Button
              type="submit"
              className="mt-5 mx-auto"
              size={"lg"}
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <PlusCircle />
              )}
              Add Cast
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
