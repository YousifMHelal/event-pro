import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert halalas to SAR and format per locale.
// Arabic uses Arabic-Indic numerals via Intl; English uses Western digits.
export function formatSar(halalas: number, locale: string): string {
  const sar = halalas / 100;
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(sar);
}

// Format a plain number per locale (Arabic-Indic for ar)
export function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA").format(n);
}
