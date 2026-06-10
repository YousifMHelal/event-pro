import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-border bg-neutral-100 text-neutral-700",
        success: "border-success-border bg-success-surface text-success",
        info: "border-info-border bg-info-surface text-info",
        warn: "border-warn-border bg-warn-surface text-warn",
        danger: "border-danger-border bg-danger-surface text-danger",
        violet: "border-violet-border bg-violet-surface text-violet",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

const dotVariants = cva("size-1.5 shrink-0 rounded-full", {
  variants: {
    variant: {
      neutral: "bg-neutral-500",
      success: "bg-success",
      info: "bg-info",
      warn: "bg-warn",
      danger: "bg-danger",
      violet: "bg-violet",
    },
  },
  defaultVariants: {
    variant: "neutral",
  },
});

export interface BadgeProps
  extends React.ComponentProps<"span">,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot = true, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden="true" className={cn(dotVariants({ variant }))} />}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
