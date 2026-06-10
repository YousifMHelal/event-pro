import type { OpportunityStage } from "@/generated/prisma/enums";

export const PIPELINE_STAGES: OpportunityStage[] = [
  "lead",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

export interface PipelineOpportunity {
  id: string;
  titleAr: string;
  titleEn: string;
  stage: OpportunityStage;
  estimatedValue: number;
  expectedCloseDate: Date | null;
  notes: string | null;
  createdAt: Date;
  clientId: string;
  client: {
    id: string;
    nameAr: string;
    nameEn: string;
    companyNameAr: string | null;
    companyNameEn: string | null;
    email: string | null;
    phone: string | null;
  };
  owner: {
    id: string;
    nameAr: string;
    nameEn: string;
  } | null;
}

export interface PipelineStats {
  totalOpportunities: number;
  pipelineValueHalalas: number;
  conversionRate: number; // 0-100
  avgCycleDays: number | null;
}

export interface ClientOption {
  id: string;
  nameAr: string;
  nameEn: string;
  companyNameAr: string | null;
  companyNameEn: string | null;
}

export interface OwnerOption {
  id: string;
  nameAr: string;
  nameEn: string;
}
