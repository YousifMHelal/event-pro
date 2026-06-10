import { prisma } from "@/lib/prisma";
import type { PipelineOpportunity, PipelineStats, ClientOption, OwnerOption } from "@/lib/crm-types";

export { PIPELINE_STAGES } from "@/lib/crm-types";
export type { PipelineOpportunity, PipelineStats, ClientOption, OwnerOption } from "@/lib/crm-types";

export async function getPipelineOpportunities(): Promise<PipelineOpportunity[]> {
  return prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titleAr: true,
      titleEn: true,
      stage: true,
      estimatedValue: true,
      expectedCloseDate: true,
      notes: true,
      createdAt: true,
      clientId: true,
      client: {
        select: {
          id: true,
          nameAr: true,
          nameEn: true,
          companyNameAr: true,
          companyNameEn: true,
          email: true,
          phone: true,
        },
      },
      owner: {
        select: { id: true, nameAr: true, nameEn: true },
      },
    },
  });
}

// Pipeline-wide stats: open opportunities, total value of open deals,
// win rate across closed deals, and average cycle time for won deals.
export async function getPipelineStats(): Promise<PipelineStats> {
  const opportunities = await prisma.opportunity.findMany({
    select: {
      stage: true,
      estimatedValue: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const open = opportunities.filter((o) => o.stage !== "won" && o.stage !== "lost");
  const won = opportunities.filter((o) => o.stage === "won");
  const lost = opportunities.filter((o) => o.stage === "lost");
  const closed = won.length + lost.length;

  const pipelineValueHalalas = open.reduce((sum, o) => sum + o.estimatedValue, 0);
  const conversionRate = closed > 0 ? (won.length / closed) * 100 : 0;

  const avgCycleDays =
    won.length > 0
      ? won.reduce((sum, o) => {
          const days = (o.updatedAt.getTime() - o.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return sum + days;
        }, 0) / won.length
      : null;

  return {
    totalOpportunities: opportunities.length,
    pipelineValueHalalas,
    conversionRate,
    avgCycleDays,
  };
}

export async function getClientOptions(): Promise<ClientOption[]> {
  return prisma.client.findMany({
    orderBy: { nameEn: "asc" },
    select: {
      id: true,
      nameAr: true,
      nameEn: true,
      companyNameAr: true,
      companyNameEn: true,
    },
  });
}

export async function getOwnerOptions(): Promise<OwnerOption[]> {
  return prisma.user.findMany({
    where: { role: "staff", isActive: true },
    orderBy: { nameEn: "asc" },
    select: { id: true, nameAr: true, nameEn: true },
  });
}
