"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface TicketQRProps {
  code: string;
  size?: number;
}

export function TicketQR({ code, size = 180 }: TicketQRProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, code, {
      width: size,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  }, [code, size]);

  return (
    <canvas
      ref={canvasRef}
      aria-label={`QR code for ticket ${code}`}
      className="rounded-md"
    />
  );
}
