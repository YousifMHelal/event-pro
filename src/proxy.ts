import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";

const { auth } = NextAuth(authConfig);

const intlMiddleware = createMiddleware(routing);

const PUBLIC_PATHS = new Set(["/login"]);

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(`/${locale}`.length);
  }
  return pathname;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const path = stripLocale(pathname);
  const session = req.auth;
  const role = session?.user?.role;

  const isPublic = PUBLIC_PATHS.has(path);
  const isPortalRoute = path.startsWith("/portal");
  const isStaffRoute =
    !isPublic &&
    !isPortalRoute &&
    !path.startsWith("/style-guide") &&
    !path.startsWith("/api");

  // Unauthenticated: only allow public paths, redirect everything else to /login.
  if (!session && !isPublic) {
    const locale = pathname.split("/")[1];
    const localePrefix = routing.locales.includes(locale as (typeof routing.locales)[number])
      ? `/${locale}`
      : `/${routing.defaultLocale}`;
    return NextResponse.redirect(new URL(`${localePrefix}/login`, req.url));
  }

  // Authenticated: keep users out of /login and / and route to their home area.
  if (session) {
    const locale = pathname.split("/")[1];
    const localePrefix = routing.locales.includes(locale as (typeof routing.locales)[number])
      ? `/${locale}`
      : `/${routing.defaultLocale}`;

    if (path === "/login" || path === "/") {
      const home = role === "client" ? "/portal" : "/dashboard";
      return NextResponse.redirect(new URL(`${localePrefix}${home}`, req.url));
    }

    if (role === "client" && isStaffRoute) {
      return NextResponse.redirect(new URL(`${localePrefix}/portal`, req.url));
    }

    if (role === "staff" && isPortalRoute) {
      return NextResponse.redirect(new URL(`${localePrefix}/dashboard`, req.url));
    }
  }

  return intlMiddleware(req);
});

export const config = {
  // Skip Next internals, API routes, and static files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
