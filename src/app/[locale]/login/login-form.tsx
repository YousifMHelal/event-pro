"use client";

import * as React from "react";
import { useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

const DEMO_ACCOUNTS = [
  { labelKey: "demoStaff", email: "sara.alqahtani@eventpro.sa", password: "Passw0rd!" },
  { labelKey: "demoClient", email: "fahad@riyadh-red.sa", password: "Passw0rd!" },
] as const;

export function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(
    loginAction,
    initialState,
  );

  function fillDemoAccount(email: string, password: string) {
    if (emailRef.current) emailRef.current.value = email;
    if (passwordRef.current) passwordRef.current.value = password;
  }

  useEffect(() => {
    if (!isPending && !state.error) {
      // Successful sign-in: refresh so the proxy redirects to the right home.
      if (state !== initialState) {
        router.refresh();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isPending]);

  const errorMessage = state.error
    ? state.error === "invalid_credentials"
      ? t("errorInvalidCredentials")
      : t("errorGeneric")
    : null;

  return (
    <form action={formAction} className="grid gap-5" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          required
          invalid={!!errorMessage}
          ref={emailRef}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">{t("password")}</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t("passwordPlaceholder")}
            required
            invalid={!!errorMessage}
            className="pe-10"
            aria-describedby={errorMessage ? "login-error" : undefined}
            ref={passwordRef}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? t("password") : t("password")}
            aria-pressed={showPassword}
            className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-foreground-muted transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <p id="login-error" role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <Button type="submit" size="lg" loading={isPending} className="w-full">
        {!isPending && <LogIn aria-hidden="true" />}
        {isPending ? t("submitting") : t("submit")}
      </Button>

      {process.env.NODE_ENV !== "production" && (
        <div className="grid gap-2 border-t border-border pt-4">
          <p className="text-xs text-foreground-muted">{t("demoCredentials")}</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map(({ labelKey, email, password }) => (
              <Button
                key={labelKey}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoAccount(email, password)}
              >
                {t(labelKey)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
