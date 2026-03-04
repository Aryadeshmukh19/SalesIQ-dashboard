export interface CompanyProfile {
  name: string
  industry: string
  businessModel: string
  teamSize: string
  growthGoal: string
  /** Geographic area chosen during onboarding, e.g. "India", "USA" */
  worldRegion: string
  /** Currency symbol derived from worldRegion, e.g. "₹", "$" */
  currency: string
}

export interface SaleRecord {
  id: string
  month: string
  region: string
  product: string
  rep: string
  revenue: number
  units: number
  cost: number
}

export interface MarketingPlan {
  executiveSummary: string
  opportunities: Array<{
    title: string
    description: string
    impact: 'High' | 'Medium' | 'Low'
    effort: 'High' | 'Medium' | 'Low'
  }>
  channels: Array<{
    name: string
    tactic: string
    kpi: string
    budgetPercent: number
  }>
  productRecommendations: {
    doubleDown: string[]
    improve: string[]
    discontinue: string[]
    reposition: string[]
  }
  roadmap: {
    q1: string
    q2: string
    q3: string
    q4: string
  }
  kpis: Array<{
    name: string
    current: string
    target: string
  }>
}
