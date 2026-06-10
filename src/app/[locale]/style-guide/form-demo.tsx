"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FormDemo() {
  const t = useTranslations("styleGuide.formDemo");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailInvalid = touched && email.length > 0 && !email.includes("@");

  return (
    <form className="grid max-w-md gap-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-2">
        <Label htmlFor="event-name">{t("eventName")}</Label>
        <Input id="event-name" placeholder={t("eventNamePlaceholder")} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="event-type">{t("eventType")}</Label>
        <Select>
          <SelectTrigger id="event-type">
            <SelectValue placeholder={t("selectPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="conference">{t("eventTypes.conference")}</SelectItem>
            <SelectItem value="wedding">{t("eventTypes.wedding")}</SelectItem>
            <SelectItem value="exhibition">{t("eventTypes.exhibition")}</SelectItem>
            <SelectItem value="workshop">{t("eventTypes.workshop")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          invalid={emailInvalid}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(true)}
          aria-describedby={emailInvalid ? "email-error" : undefined}
        />
        {emailInvalid && (
          <p id="email-error" role="alert" className="text-sm text-danger">
            {t("emailInvalid")}
          </p>
        )}
      </div>

      <div>
        <Button type="submit">{t("submit")}</Button>
      </div>
    </form>
  );
}
