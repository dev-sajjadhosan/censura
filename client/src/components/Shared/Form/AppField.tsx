import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { AnyFieldApi } from "@tanstack/react-form";

type AppFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number" | "date" | "time";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export default function AppField({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  className,
  disabled,
}: AppFieldProps) {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;
  const hasError = !!firstError;

  return (
    <>
      <div className={cn("space-y-2", className)}>
        <Label
          htmlFor={field.name}
          className={cn(
            "text-muted-foreground",
            hasError ? "text-orange-800" : "",
          )}
        >
          {label}
        </Label>
        <div
          className={`flex items-center gap-1 px-4 rounded-lg ${hasError ? "border border-orange-800 bg-destructive/10" : "bg-secondary/50"}`}
        >
          {prepend && <>{prepend}</>}
          <Input
            id={field.name}
            name={field.name}
            type={type}
            value={field.state.value}
            placeholder={placeholder}
            onBlur={() => field.handleBlur()}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            className={cn(
              "border-0 bg-transparent! text-[12px] tracking-wide",
            )}
          />
          {append && <>{append}</>}
        </div>
        {hasError && (
          <p
            id={`${field.name}-error`}
            role="alert"
            className="text-sm text-orange-800"
          >
            {firstError}
          </p>
        )}
      </div>
    </>
  );
}
