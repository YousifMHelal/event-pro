# EventPro CRM — Project Context

PRODUCT: Internal platform for a single event-organization company, plus a
client-facing portal. NOT multi-tenant SaaS.

STACK:
- Next.js 16 (App Router, React Server Components, Server Actions)
- TypeScript (strict)
- Tailwind v4 (CSS @theme tokens, no tailwind.config.js)
- next-intl for i18n
- Prisma ORM + Neon Postgres
- Auth.js (credentials)

LOCALES: Arabic (`ar`, RTL, default) and English (`en`, LTR).
- UI strings live in /messages/{ar,en}.json — never hardcode user-facing text.
- Bilingual DATA uses paired columns: nameAr/nameEn, descriptionAr/descriptionEn, etc.

THEME: LIGHT MODE ONLY. Modern, clean, lots of whitespace. Do NOT reuse the dark
navy/gold demo palette — that was the pitch deck, not the app.

MONEY: SAR. Store as Int in halalas (1 SAR = 100 halalas). Format per-locale
(Arabic-Indic numerals for ar, Western for en).

ROLES: two — `staff` (admin side) and `client` (portal). Single-tenant.

DATA RULE: real data only. Everything renders from Postgres via Prisma. No
hardcoded mock arrays in components.

DESIGN RULE: any time you build or change UI, use the `ui-ux-pro-max` skill and
source components from 21st.dev (Magic MCP). Generate/adapt components there,
then restyle to our light-mode token system — don't hand-roll from scratch.
Accessibility floor on every screen: visible keyboard focus, reduced-motion
respected, responsive down to mobile.

CONVENTIONS:
- cuid() ids, createdAt/updatedAt on every model
- Prisma enums for all status fields
- Server Components for reads, Server Actions for writes
- Zod-validate every Server Action input
- Keep comments light — only flag the tricky bits

WORKFLOW: do ONE phase per session. Stop at the phase's "Done when". Don't scope-creep into later phases.
