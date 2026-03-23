"use client";

import { registerAction } from "@/app/(auth-pages)/register/_action";
import AppField from "@/components/Shared/Form/AppField";
import AppSubmitButton from "@/components/Shared/Form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { IRegisterProps, registerZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { AtSign, Eye, EyeOff, Key, User2, UserPlus2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    if (rememberMe) {
      toast.success("Remember me", {
        description: "You will be remembered for 30 days",
        duration: 2000,
      });
    }
  }, [rememberMe]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: IRegisterProps) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      acceptTerms: false,
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const res = (await mutateAsync(value)) as any;
        console.log("Register Response:", res);

        if (!res.success) {
          setServerError(res.message || "Registration failed");
          return;
        }
      } catch (error: any) {
        console.log("Register Error:", error);
        setServerError(error.message);
      }
    },
  });

  return (
    <div className="w-full md:w-5xl h-full rounded-2xl p-5 md:p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-light">
          Welcome,{" "}
          <span className="font-bold text-muted-foreground">Movie Lover!</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          We are glad to have you here! Please enter your details to register
          and join with us to explore the world of{" "}
          <span className="font-bold text-orange-500">Censura</span>.
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-11">
        <form
          method="POST"
          action="#"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            validators={{ onChange: registerZodSchema.shape.name }}
          >
            {(field) => (
              <AppField
                prepend={<User2 className="size-5 text-muted-foreground" />}
                field={field}
                label="Name"
                type="text"
                placeholder="Enter your name"
              />
            )}
          </form.Field>
          <form.Field
            name="email"
            validators={{ onChange: registerZodSchema.shape.email }}
          >
            {(field) => (
              <AppField
                prepend={<AtSign className="size-5 text-muted-foreground" />}
                field={field}
                label="Email"
                type="email"
                placeholder="Enter your email"
              />
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{ onChange: registerZodSchema.shape.password }}
          >
            {(field) => (
              <AppField
                prepend={<Key className="size-5 text-muted-foreground" />}
                field={field}
                label="Password"
                type={showPassword ? "text" : "password"}
                // type="text"
                placeholder="Enter your password"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="cursor-pointer"
                append={
                  <Button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    variant="ghost"
                    size="icon"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                }
              />
            )}
          </form.Field>

          <div className="flex items-center justify-between mb-11">
            {/* Accept Terms */}
            <form.Field name="acceptTerms">
              {(field) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="terms-and-conditions"
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(!!checked)}
                  />
                  <Label
                    htmlFor="terms-and-conditions"
                    className="text-sm text-muted-foreground"
                  >
                    Accept Terms and Conditions
                  </Label>
                  {/* show error if not checked on submit */}
                  {field.state.meta.errors?.[0] && (
                    <p className="text-xs text-destructive">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            {/* Remember Me */}
            <form.Field name="rememberMe">
              {(field) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(!!checked);
                      setRememberMe(!!checked);
                    }}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
              )}
            </form.Field>
          </div>

          {serverError && (
            <Alert variant={"destructive"}>
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <AppSubmitButton
                isPending={isSubmitting || isPending}
                pendingLabel="Registering...."
                disabled={!canSubmit || !form.state.values.acceptTerms}
              >
                Register
                <UserPlus2 />
              </AppSubmitButton>
            )}
          </form.Subscribe>
        </form>
      </div>
      <div className="flex items-center justify-center gap-2 mt-5">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-orange-500"></div>
          <p className="text-sm text-muted-foreground">Or continue with</p>
        </div>
        <div className="grid grid-cols-3 gap-5">
          <Button size={"xl"} className="w-full gap-3" variant={"ghost"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xmlSpace="preserve"
              overflow="hidden"
              viewBox="0 0 268.152 273.883"
            >
              <defs>
                <linearGradient id="google__a">
                  <stop offset="0" stop-color="#0fbc5c" />
                  <stop offset="1" stop-color="#0cba65" />
                </linearGradient>
                <linearGradient id="google__g">
                  <stop offset=".231" stop-color="#0fbc5f" />
                  <stop offset=".312" stop-color="#0fbc5f" />
                  <stop offset=".366" stop-color="#0fbc5e" />
                  <stop offset=".458" stop-color="#0fbc5d" />
                  <stop offset=".54" stop-color="#12bc58" />
                  <stop offset=".699" stop-color="#28bf3c" />
                  <stop offset=".771" stop-color="#38c02b" />
                  <stop offset=".861" stop-color="#52c218" />
                  <stop offset=".915" stop-color="#67c30f" />
                  <stop offset="1" stop-color="#86c504" />
                </linearGradient>
                <linearGradient id="google__h">
                  <stop offset=".142" stop-color="#1abd4d" />
                  <stop offset=".248" stop-color="#6ec30d" />
                  <stop offset=".312" stop-color="#8ac502" />
                  <stop offset=".366" stop-color="#a2c600" />
                  <stop offset=".446" stop-color="#c8c903" />
                  <stop offset=".54" stop-color="#ebcb03" />
                  <stop offset=".616" stop-color="#f7cd07" />
                  <stop offset=".699" stop-color="#fdcd04" />
                  <stop offset=".771" stop-color="#fdce05" />
                  <stop offset=".861" stop-color="#ffce0a" />
                </linearGradient>
                <linearGradient id="google__f">
                  <stop offset=".316" stop-color="#ff4c3c" />
                  <stop offset=".604" stop-color="#ff692c" />
                  <stop offset=".727" stop-color="#ff7825" />
                  <stop offset=".885" stop-color="#ff8d1b" />
                  <stop offset="1" stop-color="#ff9f13" />
                </linearGradient>
                <linearGradient id="google__b">
                  <stop offset=".231" stop-color="#ff4541" />
                  <stop offset=".312" stop-color="#ff4540" />
                  <stop offset=".458" stop-color="#ff4640" />
                  <stop offset=".54" stop-color="#ff473f" />
                  <stop offset=".699" stop-color="#ff5138" />
                  <stop offset=".771" stop-color="#ff5b33" />
                  <stop offset=".861" stop-color="#ff6c29" />
                  <stop offset="1" stop-color="#ff8c18" />
                </linearGradient>
                <linearGradient id="google__d">
                  <stop offset=".408" stop-color="#fb4e5a" />
                  <stop offset="1" stop-color="#ff4540" />
                </linearGradient>
                <linearGradient id="google__c">
                  <stop offset=".132" stop-color="#0cba65" />
                  <stop offset=".21" stop-color="#0bb86d" />
                  <stop offset=".297" stop-color="#09b479" />
                  <stop offset=".396" stop-color="#08ad93" />
                  <stop offset=".477" stop-color="#0aa6a9" />
                  <stop offset=".568" stop-color="#0d9cc6" />
                  <stop offset=".667" stop-color="#1893dd" />
                  <stop offset=".769" stop-color="#258bf1" />
                  <stop offset=".859" stop-color="#3086ff" />
                </linearGradient>
                <linearGradient id="google__e">
                  <stop offset=".366" stop-color="#ff4e3a" />
                  <stop offset=".458" stop-color="#ff8a1b" />
                  <stop offset=".54" stop-color="#ffa312" />
                  <stop offset=".616" stop-color="#ffb60c" />
                  <stop offset=".771" stop-color="#ffcd0a" />
                  <stop offset=".861" stop-color="#fecf0a" />
                  <stop offset=".915" stop-color="#fecf08" />
                  <stop offset="1" stop-color="#fdcd01" />
                </linearGradient>
                <linearGradient
                  href="#google__a"
                  id="google__s"
                  x1="219.7"
                  x2="254.467"
                  y1="329.535"
                  y2="329.535"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__b"
                  id="google__m"
                  cx="109.627"
                  cy="135.862"
                  r="71.46"
                  fx="109.627"
                  fy="135.862"
                  gradientTransform="matrix(-1.93688 1.043 1.45573 2.55542 290.525 -400.634)"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__c"
                  id="google__n"
                  cx="45.259"
                  cy="279.274"
                  r="71.46"
                  fx="45.259"
                  fy="279.274"
                  gradientTransform="matrix(-3.5126 -4.45809 -1.69255 1.26062 870.8 191.554)"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__d"
                  id="google__l"
                  cx="304.017"
                  cy="118.009"
                  r="47.854"
                  fx="304.017"
                  fy="118.009"
                  gradientTransform="matrix(2.06435 0 0 2.59204 -297.679 -151.747)"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__e"
                  id="google__o"
                  cx="181.001"
                  cy="177.201"
                  r="71.46"
                  fx="181.001"
                  fy="177.201"
                  gradientTransform="matrix(-.24858 2.08314 2.96249 .33417 -255.146 -331.164)"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__f"
                  id="google__p"
                  cx="207.673"
                  cy="108.097"
                  r="41.102"
                  fx="207.673"
                  fy="108.097"
                  gradientTransform="matrix(-1.2492 1.34326 -3.89684 -3.4257 880.501 194.905)"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__g"
                  id="google__r"
                  cx="109.627"
                  cy="135.862"
                  r="71.46"
                  fx="109.627"
                  fy="135.862"
                  gradientTransform="matrix(-1.93688 -1.043 1.45573 -2.55542 290.525 838.683)"
                  gradientUnits="userSpaceOnUse"
                />
                <radialGradient
                  href="#google__h"
                  id="google__j"
                  cx="154.87"
                  cy="145.969"
                  r="71.46"
                  fx="154.87"
                  fy="145.969"
                  gradientTransform="matrix(-.0814 -1.93722 2.92674 -.11625 -215.135 632.86)"
                  gradientUnits="userSpaceOnUse"
                />
                <filter
                  id="google__q"
                  width="1.097"
                  height="1.116"
                  x="-.048"
                  y="-.058"
                  color-interpolation-filters="sRGB"
                >
                  <feGaussianBlur stdDeviation="1.701" />
                </filter>
                <filter
                  id="google__k"
                  width="1.033"
                  height="1.02"
                  x="-.017"
                  y="-.01"
                  color-interpolation-filters="sRGB"
                >
                  <feGaussianBlur stdDeviation=".242" />
                </filter>
                <clipPath id="google__i" clipPathUnits="userSpaceOnUse">
                  <path d="M371.378 193.24H237.083v53.438h77.167c-1.241 7.563-4.026 15.003-8.105 21.786-4.674 7.773-10.451 13.69-16.373 18.196-17.74 13.498-38.42 16.258-52.783 16.258-36.283 0-67.283-23.286-79.285-54.928-.484-1.149-.805-2.335-1.197-3.507a81.115 81.115 0 0 1-4.101-25.448c0-9.226 1.569-18.057 4.43-26.398 11.285-32.897 42.985-57.467 80.179-57.467 7.481 0 14.685.884 21.517 2.648a77.668 77.668 0 0 1 33.425 18.25l40.834-39.712c-24.839-22.616-57.219-36.32-95.844-36.32-30.878 0-59.386 9.553-82.748 25.7-18.945 13.093-34.483 30.625-44.97 50.985-9.753 18.879-15.094 39.8-15.094 62.294 0 22.495 5.35 43.633 15.103 62.337v.126c10.302 19.857 25.368 36.954 43.678 49.988 15.997 11.386 44.68 26.551 84.031 26.551 22.63 0 42.687-4.051 60.375-11.644 12.76-5.478 24.065-12.622 34.301-21.804 13.525-12.132 24.117-27.139 31.347-44.404 7.23-17.265 11.097-36.79 11.097-57.957 0-9.858-.998-19.87-2.689-28.968Z" />
                </clipPath>
              </defs>
              <g
                clip-path="url(#google__i)"
                transform="matrix(.95792 0 0 .98525 -90.174 -78.856)"
              >
                <path
                  fill="url(#google__j)"
                  d="M92.076 219.958c.148 22.14 6.501 44.983 16.117 63.424v.127c6.949 13.392 16.445 23.97 27.26 34.452l65.327-23.67c-12.36-6.235-14.246-10.055-23.105-17.026-9.054-9.066-15.802-19.473-20.004-31.677h-.17l.17-.127c-2.765-8.058-3.037-16.613-3.14-25.503Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="url(#google__l)"
                  d="M237.083 79.025c-6.456 22.526-3.988 44.421 0 57.161 7.457.006 14.64.888 21.45 2.647a77.662 77.662 0 0 1 33.424 18.25l41.88-40.726c-24.81-22.59-54.667-37.297-96.754-37.332Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="url(#google__m)"
                  d="M236.943 78.847c-31.67 0-60.91 9.798-84.871 26.359a145.533 145.533 0 0 0-24.332 21.15c-1.904 17.744 14.257 39.551 46.262 39.37 15.528-17.936 38.495-29.542 64.056-29.542l.07.002-1.044-57.335c-.048 0-.093-.004-.14-.004Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="url(#google__n)"
                  d="m341.475 226.379-28.268 19.285c-1.24 7.562-4.028 15.002-8.107 21.786-4.674 7.772-10.45 13.69-16.373 18.196-17.702 13.47-38.328 16.244-52.687 16.255-14.842 25.102-17.444 37.675 1.043 57.934 22.877-.016 43.157-4.117 61.046-11.796 12.931-5.551 24.388-12.792 34.761-22.097 13.706-12.295 24.442-27.503 31.769-45 7.327-17.497 11.245-37.282 11.245-58.734Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="#3086ff"
                  d="M234.996 191.21v57.498h136.006c1.196-7.874 5.152-18.064 5.152-26.5 0-9.858-.996-21.899-2.687-30.998Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="url(#google__o)"
                  d="M128.39 124.327c-8.394 9.119-15.564 19.326-21.249 30.364-9.753 18.879-15.094 41.83-15.094 64.324 0 .317.026.627.029.944 4.32 8.224 59.666 6.649 62.456 0-.004-.31-.039-.613-.039-.924 0-9.226 1.57-16.026 4.43-24.367 3.53-10.289 9.056-19.763 16.123-27.926 1.602-2.031 5.875-6.397 7.121-9.016.475-.997-.862-1.557-.937-1.908-.083-.393-1.876-.077-2.277-.37-1.275-.929-3.8-1.414-5.334-1.845-3.277-.921-8.708-2.953-11.725-5.06-9.536-6.658-24.417-14.612-33.505-24.216Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="url(#google__p)"
                  d="M162.099 155.857c22.112 13.301 28.471-6.714 43.173-12.977l-25.574-52.664a144.74 144.74 0 0 0-26.543 14.504c-12.316 8.512-23.192 18.9-32.176 30.72Z"
                  filter="url(#google__q)"
                />
                <path
                  fill="url(#google__r)"
                  d="M171.099 290.222c-29.683 10.641-34.33 11.023-37.062 29.29a144.806 144.806 0 0 0 16.792 13.984c15.996 11.386 46.766 26.551 86.118 26.551.046 0 .09-.004.137-.004v-59.157l-.094.002c-14.736 0-26.512-3.843-38.585-10.527-2.977-1.648-8.378 2.777-11.123.799-3.786-2.729-12.9 2.35-16.183-.938Z"
                  filter="url(#google__k)"
                />
                <path
                  fill="url(#google__s)"
                  d="M219.7 299.023v59.996c5.506.64 11.236 1.028 17.247 1.028 6.026 0 11.855-.307 17.52-.872v-59.748a105.119 105.119 0 0 1-17.477 1.461c-5.932 0-11.7-.686-17.29-1.865Z"
                  filter="url(#google__k)"
                  opacity=".5"
                />
              </g>
            </svg>
            Google
          </Button>
          <Button size={"xl"} className="w-full gap-3" variant={"ghost"}>
            <svg viewBox="0 0 666.667 666.667">
              <defs>
                <clipPath id="facebook_icon__a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 700h700V0H0Z" />
                </clipPath>
              </defs>
              <g
                clip-path="url(#facebook_icon__a)"
                transform="matrix(1.33333 0 0 -1.33333 -133.333 800)"
              >
                <path
                  d="M0 0c0 138.071-111.929 250-250 250S-500 138.071-500 0c0-117.245 80.715-215.622 189.606-242.638v166.242h-51.552V0h51.552v32.919c0 85.092 38.508 124.532 122.048 124.532 15.838 0 43.167-3.105 54.347-6.211V81.986c-5.901.621-16.149.932-28.882.932-40.993 0-56.832-15.528-56.832-55.9V0h81.659l-14.028-76.396h-67.631v-171.773C-95.927-233.218 0-127.818 0 0"
                  style={{
                    fill: "#0866ff",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "none",
                  }}
                  transform="translate(600 350)"
                />
                <path
                  d="m0 0 14.029 76.396H-67.63v27.019c0 40.372 15.838 55.899 56.831 55.899 12.733 0 22.981-.31 28.882-.931v69.253c-11.18 3.106-38.509 6.212-54.347 6.212-83.539 0-122.048-39.441-122.048-124.533V76.396h-51.552V0h51.552v-166.242a250.559 250.559 0 0 1 60.394-7.362c10.254 0 20.358.632 30.288 1.831V0Z"
                  style={{
                    fill: "#fff",
                    fillOpacity: 1,
                    fillRule: "nonzero",
                    stroke: "none",
                  }}
                  transform="translate(447.918 273.604)"
                />
              </g>
            </svg>
            Facebook
          </Button>
          <Button size={"xl"} className="w-full gap-3" variant={"ghost"}>
            <svg viewBox="0 0 1024 1024" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                transform="scale(64)"
                fill="#ffff"
              />
            </svg>
            Github
          </Button>
        </div>
      </div>
    </div>
  );
}
