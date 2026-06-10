import type { BoothStatus } from "@/generated/prisma/enums";

// Tile background/border/text classes for the floor-plan grid, keyed by status.
export const BOOTH_TILE_CLASSES: Record<BoothStatus, string> = {
  available:
    "border-border bg-surface text-foreground hover:border-neutral-300 hover:bg-neutral-50",
  reserved:
    "border-info-border bg-info-surface text-info hover:bg-info-surface/70",
  contracted:
    "border-warn-border bg-warn-surface text-warn hover:bg-warn-surface/70",
  production:
    "border-violet-border bg-violet-surface text-violet hover:bg-violet-surface/70",
  delivered:
    "border-success-border bg-success-surface text-success hover:bg-success-surface/70",
};

export const BOOTH_DOT_CLASSES: Record<BoothStatus, string> = {
  available: "bg-neutral-400",
  reserved: "bg-info",
  contracted: "bg-warn",
  production: "bg-violet",
  delivered: "bg-success",
};
