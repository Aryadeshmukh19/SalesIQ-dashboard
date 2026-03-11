'use client'

import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import type { CompanyProfile, SaleRecord, MarketingPlan } from '@/lib/types'
import {
  Sparkles,
  Loader2,
  TrendingUp,
  Megaphone,
  Package,
  CalendarDays,
  Target,
  AlertCircle,
} from 'lucide-react'

interface MarketingTabProps {
  profile: CompanyProfile
  data: SaleRecord[]
}

const sectionTabs = [
  { id: 'summary', label: 'Summary', icon: TrendingUp },
  { id: 'opportunities', label: 'Opportunities', icon: Target },
  { id: 'channels', label: 'Channels', icon: Megaphone },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'roadmap', label: 'Roadmap', icon: CalendarDays },
  { id: 'kpis', label: 'KPIs', icon: Target },
]

export function MarketingTab({ profile, data }: MarketingTabProps) {
  const [plan, setPlan] = useState<MarketingPlan | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState('summary')

  const salesSummary = useMemo(() => {
    const totalRevenue = data.reduce((s, r) => s + r.revenue, 0)
    const totalCost = data.reduce((s, r) => s + r.cost, 0)
    const totalUnits = data.reduce((s, r) => s + r.units, 0)

    const prodMap = new Map<string, number>()
    data.forEach((r) => prodMap.set(r.product, (prodMap.get(r.product) || 0) + r.revenue))
    const products = Array.from(prodMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, rev]) => `  - ${name}: ${formatCurrency(rev)}`)
      .join('\n')

    const regMap = new Map<string, number>()
    data.forEach((r) => regMap.set(r.region, (regMap.get(r.region) || 0) + r.revenue))
    const regions = Array.from(regMap.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, rev]) => `  - ${name}: ${formatCurrency(rev)}`)
      .join('\n')

    return `Total Revenue: ${formatCurrency(totalRevenue)}
Total Cost: ${formatCurrency(totalCost)}
Total Profit: ${formatCurrency(totalRevenue - totalCost)}
Profit Margin: ${totalRevenue > 0 ? (((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(1) : 0}%
Total Units Sold: ${totalUnits.toLocaleString()}
Number of Sales: ${data.length}

Revenue by Product:
${products}

Revenue by Region:
${regions}`
  }, [data])

  const generatePlan = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyProfile: profile, salesSummary }),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to generate plan')
      }

      const planData = await res.json()
      setPlan(planData)
      setActiveSection('summary')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [profile, salesSummary])

  const impactColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-success/15 text-success border-none'
      case 'Medium': return 'bg-warning/15 text-warning border-none'
      case 'Low': return 'bg-muted text-muted-foreground border-none'
      default: return ''
    }
  }

  if (!plan && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center glass-card border-none shadow-sm">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 relative">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
          <div className="absolute -inset-1 rounded-3xl bg-primary/20 blur-xl opacity-50" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-foreground">
          AI Strategy Architect
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground font-medium leading-relaxed">
          Leverage enterprise-grade intelligence to synthesize your performance data into a high-impact roadmap.
        </p>
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-destructive/5 px-4 py-3 text-xs font-bold uppercase tracking-widest text-destructive border border-destructive/10">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <Button onClick={generatePlan} className="mt-8 gap-2 h-12 rounded-xl px-10 font-bold uppercase tracking-widest text-[11px] shadow-lg enterprise-shadow-lg transition-all hover:scale-[1.02]" size="lg">
          <Sparkles className="h-4 w-4" />
          Initialize Strategy
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center glass-card border-none shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <Loader2 className="mb-6 h-12 w-12 animate-spin text-primary relative z-10" />
        <h3 className="font-serif text-2xl font-bold text-foreground relative z-10">Synthesizing Strategy</h3>
        <p className="mt-2 text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60 relative z-10">
          Claude Intelligence is modeling your growth trajectory...
        </p>
      </div>
    )
  }

  if (!plan) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md p-1.5 shadow-inner">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeSection === tab.id
              ? 'bg-primary text-primary-foreground shadow-lg enterprise-shadow'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
              }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      {activeSection === 'summary' && (
        <div className="animate-fade-up glass-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <div>
              <h3 className="font-serif text-xl font-bold text-card-foreground">
                Executive Strategy Brief
              </h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Core Strategic Recommendation</p>
            </div>
          </div>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground/90 font-medium font-sans">
            {plan.executiveSummary}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {activeSection === 'opportunities' && (
        <div className="grid gap-6 md:grid-cols-3">
          {plan.opportunities.map((opp, i) => (
            <div
              key={i}
              className="animate-fade-up glass-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-4 p-2 rounded-lg bg-primary/5 w-fit">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <h4 className="mb-2 font-serif text-lg font-bold text-card-foreground leading-tight">{opp.title}</h4>
              <p className="mb-5 text-xs text-muted-foreground font-medium leading-relaxed">{opp.description}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${impactColor(opp.impact)}`}>
                  IMP: {opp.impact}
                </Badge>
                <Badge className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${impactColor(opp.effort)}`}>
                  EFF: {opp.effort}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Channels */}
      {activeSection === 'channels' && (
        <div className="grid gap-6 md:grid-cols-2">
          {plan.channels.map((ch, i) => (
            <div
              key={i}
              className="animate-fade-up glass-card group p-6 shadow-sm hover:shadow-lg transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Megaphone className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-lg font-bold text-card-foreground">{ch.name}</h4>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/5 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">
                  {ch.budgetPercent}% Yield
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Strategic Tactic</p>
                  <p className="text-sm font-medium text-card-foreground leading-tight">{ch.tactic}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Success Metric</p>
                  <p className="text-sm font-medium text-card-foreground leading-tight">{ch.kpi}</p>
                </div>
              </div>
              {/* Budget bar */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  <span>Investment Allocation</span>
                  <span>{ch.budgetPercent}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                  <div
                    className="h-full rounded-full bg-primary/60 group-hover:bg-primary transition-all duration-700"
                    style={{ width: `${ch.budgetPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Recommendations */}
      {activeSection === 'products' && (
        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              label: 'Double Down',
              items: plan.productRecommendations.doubleDown,
              color: 'text-emerald-600 bg-emerald-500/10',
              icon: <TrendingUp className="h-4 w-4" />,
            },
            {
              label: 'Improve',
              items: plan.productRecommendations.improve,
              color: 'text-amber-600 bg-amber-500/10',
              icon: <AlertCircle className="h-4 w-4" />,
            },
            {
              label: 'Discontinue',
              items: plan.productRecommendations.discontinue,
              color: 'text-rose-600 bg-rose-500/10',
              icon: <Package className="h-4 w-4" />,
            },
            {
              label: 'Reposition',
              items: plan.productRecommendations.reposition,
              color: 'text-primary bg-primary/10',
              icon: <Target className="h-4 w-4" />,
            },
          ].map((cat, i) => (
            <div
              key={cat.label}
              className={`animate-fade-up glass-card group p-6 shadow-sm hover:shadow-md transition-all`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-5 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${cat.color}`}>
                  {cat.icon}
                </div>
                <h4 className={`text-xs font-bold uppercase tracking-widest ${cat.color.split(' ')[0]}`}>
                  {cat.label}
                </h4>
              </div>
              <ul className="flex flex-col gap-3">
                {cat.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-sm font-medium text-card-foreground/80 leading-snug"
                  >
                    <div className={`mt-1 h-3 w-1 rounded-full ${cat.color.split(' ')[0].replace('text', 'bg')} shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Roadmap */}
      {activeSection === 'roadmap' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Q1', content: plan.roadmap.q1, desc: 'Foundation & Setup' },
            { label: 'Q2', content: plan.roadmap.q2, desc: 'Growth & Scaling' },
            { label: 'Q3', content: plan.roadmap.q3, desc: 'Market Penetration' },
            { label: 'Q4', content: plan.roadmap.q4, desc: 'Profit Optimization' },
          ].map((q, i) => (
            <div
              key={q.label}
              className="animate-fade-up glass-card group p-6 shadow-sm hover:bg-primary/5 transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary tracking-widest group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {q.label}
                </div>
                <div className="h-1 w-8 rounded-full bg-muted/40 group-last:hidden" />
              </div>
              <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-tight">{q.desc}</h4>
              <p className="text-[13px] font-medium leading-relaxed text-card-foreground/80">{q.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      {activeSection === 'kpis' && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plan.kpis.map((kpi, i) => (
            <div
              key={i}
              className="animate-fade-up glass-card group p-6 shadow-sm hover:shadow-lg transition-all"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-tight h-8">{kpi.name}</p>
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Current</span>
                    <p className="text-lg font-bold text-card-foreground">{kpi.current}</p>
                  </div>
                  <div className="h-1 w-full rounded-full bg-muted/30">
                    <div className="h-full w-2/3 rounded-full bg-muted transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Target</span>
                    <p className="text-lg font-bold text-emerald-600">{kpi.target}</p>
                  </div>
                  <div className="h-1 w-full rounded-full bg-emerald-500/10">
                    <div className="h-full w-full rounded-full bg-emerald-500/30 transition-all" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regenerate button */}
      <div className="flex justify-center mt-8">
        <Button
          variant="outline"
          onClick={generatePlan}
          disabled={loading}
          className="gap-2 h-11 rounded-xl px-8 font-bold uppercase tracking-widest text-[10px] border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Refine Strategic Model
        </Button>
      </div>
    </div>
  )
}
