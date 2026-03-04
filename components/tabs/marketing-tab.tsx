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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-serif text-xl text-foreground">
          AI Marketing Strategist
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Generate a comprehensive marketing plan powered by Claude AI. It analyzes
          your company profile and sales data to deliver actionable strategies.
        </p>
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <Button onClick={generatePlan} className="mt-6 gap-2" size="lg">
          <Sparkles className="h-4 w-4" />
          Generate Marketing Plan
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
        <h3 className="font-serif text-xl text-foreground">Analyzing your data...</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Claude is building your marketing strategy.
        </p>
      </div>
    )
  }

  if (!plan) return null

  return (
    <div className="flex flex-col gap-6">
      {/* Section tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 shadow-sm">
        {sectionTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activeSection === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      {activeSection === 'summary' && (
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Executive Summary
          </h3>
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-card-foreground">
            {plan.executiveSummary}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {activeSection === 'opportunities' && (
        <div className="grid gap-4 md:grid-cols-3">
          {plan.opportunities.map((opp, i) => (
            <div
              key={i}
              className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h4 className="mb-2 font-medium text-card-foreground">{opp.title}</h4>
              <p className="mb-3 text-sm text-muted-foreground">{opp.description}</p>
              <div className="flex gap-2">
                <Badge className={impactColor(opp.impact)}>
                  Impact: {opp.impact}
                </Badge>
                <Badge className={impactColor(opp.effort)}>
                  Effort: {opp.effort}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Channels */}
      {activeSection === 'channels' && (
        <div className="grid gap-4 md:grid-cols-2">
          {plan.channels.map((ch, i) => (
            <div
              key={i}
              className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="font-medium text-card-foreground">{ch.name}</h4>
                <Badge className="border-none bg-primary/10 text-primary">
                  {ch.budgetPercent}% Budget
                </Badge>
              </div>
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground">Tactic</p>
                <p className="text-sm text-card-foreground">{ch.tactic}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">KPI</p>
                <p className="text-sm text-card-foreground">{ch.kpi}</p>
              </div>
              {/* Budget bar */}
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${ch.budgetPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Recommendations */}
      {activeSection === 'products' && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              label: 'Double Down',
              items: plan.productRecommendations.doubleDown,
              color: 'bg-success/10 text-success',
              border: 'border-success/20',
            },
            {
              label: 'Improve',
              items: plan.productRecommendations.improve,
              color: 'bg-warning/10 text-warning',
              border: 'border-warning/20',
            },
            {
              label: 'Discontinue',
              items: plan.productRecommendations.discontinue,
              color: 'bg-destructive/10 text-destructive',
              border: 'border-destructive/20',
            },
            {
              label: 'Reposition',
              items: plan.productRecommendations.reposition,
              color: 'bg-primary/10 text-primary',
              border: 'border-primary/20',
            },
          ].map((cat, i) => (
            <div
              key={cat.label}
              className={`animate-fade-up rounded-2xl border bg-card p-5 shadow-sm ${cat.border}`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <h4 className={`mb-3 text-sm font-semibold ${cat.color.split(' ')[1]}`}>
                {cat.label}
              </h4>
              <ul className="flex flex-col gap-2">
                {cat.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2 text-sm text-card-foreground"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${cat.color.split(' ')[0]} shrink-0`} />
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Q1', content: plan.roadmap.q1 },
            { label: 'Q2', content: plan.roadmap.q2 },
            { label: 'Q3', content: plan.roadmap.q3 },
            { label: 'Q4', content: plan.roadmap.q4 },
          ].map((q, i) => (
            <div
              key={q.label}
              className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
                {q.label}
              </div>
              <p className="text-sm leading-relaxed text-card-foreground">{q.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* KPIs */}
      {activeSection === 'kpis' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plan.kpis.map((kpi, i) => (
            <div
              key={i}
              className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-sm"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <p className="mb-2 text-xs font-medium text-muted-foreground">{kpi.name}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-lg font-semibold text-card-foreground">{kpi.current}</p>
                <span className="text-xs text-muted-foreground">current</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <p className="text-lg font-semibold text-success">{kpi.target}</p>
                <span className="text-xs text-muted-foreground">target</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Regenerate button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={generatePlan}
          disabled={loading}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Regenerate Plan
        </Button>
      </div>
    </div>
  )
}
