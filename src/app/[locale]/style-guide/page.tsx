import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { FormDemo } from "./form-demo";
import { DialogDemo } from "./dialog-demo";

const colorTokens = [
  { key: "background", swatch: "bg-background border border-border" },
  { key: "surface", swatch: "bg-surface border border-border" },
  { key: "surfaceMuted", swatch: "bg-surface-muted border border-border" },
  { key: "primary", swatch: "bg-primary" },
  { key: "accent", swatch: "bg-accent" },
  { key: "neutral", swatch: "bg-neutral-500" },
  { key: "success", swatch: "bg-success" },
  { key: "info", swatch: "bg-info" },
  { key: "warn", swatch: "bg-warn" },
  { key: "danger", swatch: "bg-danger" },
] as const;

export default function StyleGuidePage() {
  const t = useTranslations("styleGuide");

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-foreground">{t("title")}</h1>
        <p className="max-w-2xl text-foreground-muted">{t("description")}</p>
      </header>

      {/* Colors */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.colors")}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {colorTokens.map(({ key, swatch }) => (
            <div key={key} className="flex flex-col gap-2">
              <div className={`h-16 rounded-lg ${swatch}`} />
              <span className="text-sm font-medium text-foreground">
                {t(`colorTokens.${key}`)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.typography")}</h2>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-foreground">{t("typographyScale.h1")}</h1>
          <h2 className="text-3xl font-semibold text-foreground">{t("typographyScale.h2")}</h2>
          <h3 className="text-2xl font-semibold text-foreground">{t("typographyScale.h3")}</h3>
          <h4 className="text-xl font-semibold text-foreground">{t("typographyScale.h4")}</h4>
          <p className="max-w-prose text-base leading-relaxed text-foreground">
            {t("typographyScale.body")}
          </p>
          <p className="text-sm text-foreground-muted">{t("typographyScale.small")}</p>
          <p className="text-sm text-foreground-muted">{t("typographyScale.fontNote")}</p>
        </div>
      </section>

      {/* Buttons */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.buttons")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">{t("buttonLabels.primary")}</Button>
          <Button variant="secondary">{t("buttonLabels.secondary")}</Button>
          <Button variant="outline">{t("buttonLabels.outline")}</Button>
          <Button variant="ghost">{t("buttonLabels.ghost")}</Button>
          <Button variant="destructive">{t("buttonLabels.destructive")}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">{t("buttonLabels.small")}</Button>
          <Button size="md">{t("buttonLabels.medium")}</Button>
          <Button size="lg">{t("buttonLabels.large")}</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button loading>{t("buttonLabels.loading")}</Button>
          <Button disabled>{t("buttonLabels.disabled")}</Button>
        </div>
      </section>

      {/* Badges */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.badges")}</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">{t("badgeLabels.neutral")}</Badge>
          <Badge variant="success">{t("badgeLabels.success")}</Badge>
          <Badge variant="info">{t("badgeLabels.info")}</Badge>
          <Badge variant="warn">{t("badgeLabels.warn")}</Badge>
          <Badge variant="danger">{t("badgeLabels.danger")}</Badge>
        </div>
      </section>

      {/* Cards */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.cards")}</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>{t("cardDemo.title")}</CardTitle>
            <CardDescription>{t("cardDemo.description")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground-muted">{t("cardDemo.date")}</span>
              <span className="font-medium text-foreground">2026-09-14</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">{t("cardDemo.venue")}</span>
              <span className="font-medium text-foreground">{t("cardDemo.venueValue")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground-muted">{t("cardDemo.budget")}</span>
              <span className="font-medium text-foreground">١٢٥٬٠٠٠ ر.س</span>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button size="sm" variant="outline">
              {t("cardDemo.viewDetails")}
            </Button>
          </CardFooter>
        </Card>
      </section>

      {/* Form */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.form")}</h2>
        <FormDemo />
      </section>

      {/* Table */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.table")}</h2>
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("tableDemo.client")}</TableHead>
                <TableHead>{t("tableDemo.event")}</TableHead>
                <TableHead>{t("tableDemo.date")}</TableHead>
                <TableHead>{t("tableDemo.amount")}</TableHead>
                <TableHead>{t("tableDemo.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{t("tableDemo.rows.row1.client")}</TableCell>
                <TableCell>{t("tableDemo.rows.row1.event")}</TableCell>
                <TableCell>2026-07-02</TableCell>
                <TableCell>٤٥٬٠٠٠ ر.س</TableCell>
                <TableCell>
                  <Badge variant="success">{t("badgeLabels.success")}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">{t("tableDemo.rows.row2.client")}</TableCell>
                <TableCell>{t("tableDemo.rows.row2.event")}</TableCell>
                <TableCell>2026-08-19</TableCell>
                <TableCell>٧٨٬٥٠٠ ر.س</TableCell>
                <TableCell>
                  <Badge variant="info">{t("badgeLabels.info")}</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">{t("tableDemo.rows.row3.client")}</TableCell>
                <TableCell>{t("tableDemo.rows.row3.event")}</TableCell>
                <TableCell>2026-05-30</TableCell>
                <TableCell>٣٢٬٠٠٠ ر.س</TableCell>
                <TableCell>
                  <Badge variant="danger">{t("badgeLabels.danger")}</Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Tabs */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.tabs")}</h2>
        <Tabs defaultValue="overview" className="max-w-md">
          <TabsList>
            <TabsTrigger value="overview">{t("tabsDemo.overview")}</TabsTrigger>
            <TabsTrigger value="clients">{t("tabsDemo.clients")}</TabsTrigger>
            <TabsTrigger value="billing">{t("tabsDemo.billing")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-sm text-foreground-muted">
            {t("tabsDemo.overviewContent")}
          </TabsContent>
          <TabsContent value="clients" className="text-sm text-foreground-muted">
            {t("tabsDemo.clientsContent")}
          </TabsContent>
          <TabsContent value="billing" className="text-sm text-foreground-muted">
            {t("tabsDemo.billingContent")}
          </TabsContent>
        </Tabs>
      </section>

      {/* Dialog */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.dialog")}</h2>
        <DialogDemo />
      </section>

      {/* Skeleton */}
      <section className="flex flex-col gap-4 pb-12">
        <h2 className="text-2xl font-semibold text-foreground">{t("sections.skeleton")}</h2>
        <div className="flex max-w-md flex-col gap-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-24 w-full" />
        </div>
      </section>
    </div>
  );
}
