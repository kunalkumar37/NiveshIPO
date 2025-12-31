
export type RiskLevel = 'Low' | 'Moderate' | 'High';
export type IPOType = 'Mainboard' | 'SME';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface FinancialMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface SubscriptionData {
  qib: number;
  nii: number;
  retail: number;
  total: number;
  updatedAt: string;
}

export interface IPO {
  id: string;
  companyName: string;
  symbol: string;
  status: 'Live' | 'Upcoming' | 'Closed';
  ipoType: IPOType;
  issueSize: string;
  priceBand: string;
  lotSize: number;
  openDate: string;
  closeDate: string;
  listingDate: string;
  gmp: string;
  listingGainEstimate?: string; // AI Feature
  description: string;
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  subscription?: SubscriptionData;
  financials: FinancialMetric[];
  valuation: FinancialMetric[];
  registrar: string;
  leadManager: string;
  sector: string;
  sources?: GroundingSource[];
}

export interface RiskAnalysis {
  fundamentals: RiskLevel;
  stability: RiskLevel;
  pricing: RiskLevel;
  sentiment: RiskLevel;
  summary: string;
  redFlags: string[];
  strengths: string[];
  sources?: GroundingSource[];
  suitabilityScore?: number; // 0-100
  investorPersona?: string;
  sectorOutlook?: string; // New AI Feature
  listingStrategy?: string; // New AI Feature
}

export interface WeightPreferences {
  fundamentals: number;
  valuation: number;
  sentiment: number;
}
