"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Camera, CameraOff, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QrScannerProps {
  onScan: (code: string) => void;
  disabled?: boolean;
}

export function QrScanner({ onScan, disabled }: QrScannerProps) {
  const t = useTranslations("checkin");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const readerRef = useRef<import("@zxing/library").BrowserMultiFormatReader | null>(null);

  const stopScanner = useCallback(() => {
    readerRef.current?.reset();
    readerRef.current = null;
    setActive(false);
  }, []);

  const startScanner = useCallback(async () => {
    setCameraError(null);
    setStarting(true);
    try {
      const { BrowserMultiFormatReader } = await import("@zxing/library");
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      const devices = await reader.listVideoInputDevices();
      if (devices.length === 0) {
        setCameraError(t("scanner.noCamera"));
        setStarting(false);
        return;
      }

      // Prefer back camera on mobile
      const backCamera = devices.find(
        (d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("rear"),
      );
      const deviceId = backCamera?.deviceId ?? devices[0].deviceId;

      if (!videoRef.current) {
        setStarting(false);
        return;
      }

      await reader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
        if (result) {
          onScan(result.getText());
        }
        // Suppress benign NotFoundException that fires every frame when no QR is visible
        if (err && err.name !== "NotFoundException") {
          console.error("QR scan error:", err);
        }
      });

      setActive(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("Permission") || msg.includes("NotAllowed")) {
        setCameraError(t("scanner.permissionDenied"));
      } else {
        setCameraError(t("scanner.error"));
      }
    } finally {
      setStarting(false);
    }
  }, [onScan, t]);

  // Auto-start on mount; clean up on unmount
  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle() {
    if (active) {
      stopScanner();
    } else {
      startScanner();
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Viewfinder */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-neutral-900 aspect-square shadow-card">
        <video
          ref={videoRef}
          className={active ? "h-full w-full object-cover" : "hidden"}
          autoPlay
          playsInline
          muted
          aria-label={t("scanner.videoLabel")}
        />

        {/* Idle / starting state */}
        {!active && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-neutral-400">
            {starting ? (
              <>
                <Loader2 className="size-10 animate-spin text-neutral-300" aria-hidden="true" />
                <span className="text-sm text-neutral-400">{t("scanner.starting")}</span>
              </>
            ) : (
              <>
                <CameraOff className="size-10" aria-hidden="true" />
                <span className="text-sm">{t("scanner.inactive")}</span>
              </>
            )}
          </div>
        )}

        {/* Processing overlay — dims the feed while a code is being verified */}
        {active && disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <Loader2 className="size-8 animate-spin text-white" aria-hidden="true" />
          </div>
        )}

        {/* Corner guides + scanline */}
        {active && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative size-52">
              {/* Corner brackets */}
              {(["tl", "tr", "bl", "br"] as const).map((corner) => (
                <span
                  key={corner}
                  className={[
                    "absolute h-8 w-8 border-white/80",
                    corner === "tl" ? "top-0 left-0 rounded-tl border-t-[3px] border-l-[3px]" : "",
                    corner === "tr" ? "top-0 right-0 rounded-tr border-t-[3px] border-r-[3px]" : "",
                    corner === "bl" ? "bottom-0 left-0 rounded-bl border-b-[3px] border-l-[3px]" : "",
                    corner === "br" ? "bottom-0 right-0 rounded-br border-b-[3px] border-r-[3px]" : "",
                  ].join(" ")}
                />
              ))}
              {/* Scanline */}
              <span
                className="absolute inset-x-0 h-0.5 rounded-full bg-accent/80 shadow-[0_0_6px_2px_var(--color-accent)] animate-[scanline_2s_ease-in-out_infinite]"
                style={{ top: "50%" }}
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </div>

      {cameraError && (
        <p role="alert" className="max-w-xs text-center text-sm text-danger">
          {cameraError}
        </p>
      )}

      <Button
        type="button"
        variant={active ? "outline" : "primary"}
        onClick={toggle}
        disabled={disabled || starting}
        className="w-full"
      >
        {starting ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            {t("scanner.starting")}
          </>
        ) : active ? (
          <>
            <CameraOff aria-hidden="true" />
            {t("scanner.stop")}
          </>
        ) : cameraError ? (
          <>
            <RefreshCw aria-hidden="true" />
            {t("scanner.retry")}
          </>
        ) : (
          <>
            <Camera aria-hidden="true" />
            {t("scanner.start")}
          </>
        )}
      </Button>
    </div>
  );
}
