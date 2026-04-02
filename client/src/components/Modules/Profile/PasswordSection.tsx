"use client";

import { IPasswordProps, passwordSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, Loader, Lock } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionHeader from "./SectionHeader";
import FieldWrapper from "./FieldWrapper";
import { chnagePassword } from "@/services/user.service";
import { useState } from "react";

export default function PasswordSection() {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (name: string) => {
    setVisibility((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IPasswordProps) => {
      return await chnagePassword(data);
    },
    onSuccess: () => {
      toast.success("Password updated successfully.");
      form.reset();
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (e: any) => {
      toast.error(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to update password.",
      );
    },
  });

  const form = useForm({
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    validators: {
      onChange: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync(value as IPasswordProps);
      } catch (e: any) {
        console.error(e.message);
      }
    },
  });

  const fieldConfigs = [
    { name: "oldPassword", label: "Current password" },
    { name: "newPassword", label: "New password" },
    { name: "confirmPassword", label: "Confirm new password" },
  ] as const;

  return (
    <div>
      <SectionHeader
        title="Change Password"
        desc="Use a strong password with letters, numbers, and symbols."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-5 max-w-md"
      >
        {fieldConfigs.map(({ name, label }) => (
          <form.Field key={name} name={name}>
            {(field) => {
              const hasError =
                field.state.meta.isTouched &&
                field.state.meta.errors.length > 0;

              return (
                <FieldWrapper
                  label={label}
                  error={
                    field.state.meta.isTouched
                      ? field.state.meta.errors[0]?.message
                      : ""
                  }
                >
                  <div
                    className={`flex items-center gap-2 bg-secondary px-3 rounded-lg border-2 transition-colors ${
                      hasError
                        ? "border-destructive"
                        : "border-transparent focus-within:border-primary/50"
                    }`}
                  >
                    <KeyRound className="text-muted-foreground size-5" />
                    <Input
                      type={visibility[name] ? "text" : "password"}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      type="button"
                      tabIndex={-1}
                      onClick={() => toggleVisibility(name)}
                    >
                      {visibility[name] ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </Button>
                  </div>
                </FieldWrapper>
              );
            }}
          </form.Field>
        ))}

        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={isPending}
            className="gap-2"
          >
            {isPending ? (
              <Loader size={15} className="animate-spin" />
            ) : (
              <Lock size={15} />
            )}
            Update password
          </Button>
        </div>
      </form>
    </div>
  );
}
