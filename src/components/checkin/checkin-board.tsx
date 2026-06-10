"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ScanLine, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrScanner } from "@/components/checkin/qr-scanner";
import { CheckinResult } from "@/components/checkin/checkin-result";
import { checkInByCode } from "@/app/[locale]/(app)/checkin/actions";
import type { CheckInResult } from "@/lib/tickets-types";

type Mode = "scanner" | "manual";

export function CheckinBoard() {
  const t = useTranslations("checkin");

  const [mode, setMode] = useState<Mode>("scanner");
  const [processing, setProcessing] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [manualCode, setManualCode] = useState("");

  const resultTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const processCode = useCallback(
    async (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (!normalized || processing) return;

      // Debounce: don't re-scan the same code within 3 s
      if (normalized === lastCode) return;

      if (resultTimeout.current) clearTimeout(resultTimeout.current);

      setProcessing(true);
      setLastCode(normalized);
      setResult(null);

      const res = await checkInByCode({ code: normalized });
      setResult(res);
      setProcessing(false);
      setManualCode("");

      // Auto-clear result after 6 s in scanner mode
      if (mode === "scanner") {
        resultTimeout.current = setTimeout(() => {
          setResult(null);
          setLastCode(null);
        }, 6000);
      }
    },
    [processing, lastCode, mode],
  );

  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    await processCode(manualCode);
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      {/* Mode tabs */}
      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1" role="tablist" aria-label={t("modeTabs")}>
        <button
          role="tab"
          aria-selected={mode === "scanner"}
          onClick={() => { setMode("scanner"); setResult(null); setLastCode(null); }}
          className={[
            "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors",
            mode === "scanner"
              ? "bg-surface text-foreground shadow-card"
              : "text-foreground-muted hover:text-foreground",
          ].join(" ")}
        >
          <ScanLine className="size-4" aria-hidden="true" />
          {t("scanTab")}
        </button>
        <button
          role="tab"
          aria-selected={mode === "manual"}
          onClick={() => { setMode("manual"); setResult(null); setLastCode(null); }}
          className={[
            "flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors",
            mode === "manual"
              ? "bg-surface text-foreground shadow-card"
              : "text-foreground-muted hover:text-foreground",
          ].join(" ")}
        >
          <Keyboard className="size-4" aria-hidden="true" />
          {t("manualTab")}
        </button>
      </div>

      {/* Content */}
      {mode === "scanner" ? (
        <QrScanner onScan={processCode} disabled={processing} />
      ) : (
        <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="manualCode">{t("manual.label")}</Label>
            <Input
              id="manualCode"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder={t("manual.placeholder")}
              autoFocus
              autoCapitalize="characters"
              spellCheck={false}
              autoComplete="off"
              className="font-mono uppercase"
            />
          </div>
          <Button type="submit" loading={processing} disabled={!manualCode.trim()}>
            {processing ? t("manual.checking") : t("manual.submit")}
          </Button>
        </form>
      )}

      {/* Processing indicator */}
      {processing && (
        <p className="text-center text-sm text-foreground-muted animate-pulse">
          {t("checking")}
        </p>
      )}

      {/* Result card */}
      {result && lastCode && (
        <CheckinResult result={result} code={lastCode} />
      )}
    </div>
  );
}
