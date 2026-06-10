import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Store,
  Ticket,
  Clapperboard,
  Wallet,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  labelKey: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/events", labelKey: "events", icon: CalendarDays },
  { href: "/clients", labelKey: "clients", icon: Users },
  { href: "/booths", labelKey: "booths", icon: Store },
  { href: "/tickets", labelKey: "tickets", icon: Ticket },
  { href: "/production", labelKey: "production", icon: Clapperboard },
  { href: "/finance", labelKey: "finance", icon: Wallet },
  { href: "/reports", labelKey: "reports", icon: BarChart3 },
];
