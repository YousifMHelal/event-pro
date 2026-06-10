import { getTranslations } from "next-intl/server";
import {
  getPipelineOpportunities,
  getPipelineStats,
  getClientOptions,
  getOwnerOptions,
} from "@/lib/crm";
import { PipelineStatsBar } from "@/components/crm/pipeline-stats-bar";
import { KanbanBoard } from "@/components/crm/kanban-board";

export default async function ClientsPage() {
  const t = await getTranslations("crm");

  const [opportunities, stats, clients, owners] = await Promise.all([
    getPipelineOpportunities(),
    getPipelineStats(),
    getClientOptions(),
    getOwnerOptions(),
  ]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8">
      <div>
        <h1 className="text-foreground text-3xl font-semibold">{t("title")}</h1>
        <p className="text-foreground-muted mt-1 text-base">{t("subtitle")}</p>
      </div>

      <PipelineStatsBar stats={stats} />

      <KanbanBoard
        opportunities={opportunities}
        clients={clients}
        owners={owners}
      />
    </div>
  );
}
