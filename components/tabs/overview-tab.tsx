'use client'

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'
import { formatCurrency, formatCurrencyFull } from '@/lib/format'
import { CHART_COLORS, REVENUE_COLOR, PROFIT_COLOR } from '@/lib/chart-colors'
import { months } from '@/lib/industry-templates'
import type { SaleRecord } from '@/lib/types'
import { TrendingUp, Star, MapPin, User } from 'lucide-react'

interface OverviewTabProps {
  data: SaleRecord[]
  currency?: string
}

function ChartTooltipContent({ active, payload, label, currency = '$' }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; currency?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-md">
      <p className="mb-1 text-sm font-medium text-card-foreground">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-sm">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-medium text-card-foreground">
            {formatCurrencyFull(entry.value, currency)}
          </span>
        </div>
      ))}
    </div>
  )
}

export function OverviewTab({ data, currency = '$' }: OverviewTabProps) {
  const monthlyData = useMemo(() => {
    return months.map((month) => {
      const monthRecords = data.filter((r) => r.month === month)
      const revenue = monthRecords.reduce((s, r) => s + r.revenue, 0)
      const cost = monthRecords.reduce((s, r) => s + r.cost, 0)
      return { month, revenue, profit: revenue - cost }
    })
  }, [data])

  const productData = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((r) => map.set(r.product, (map.get(r.product) || 0) + r.revenue))
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const unitsData = useMemo(() => {
    return months.map((month) => {
      const monthRecords = data.filter((r) => r.month === month)
      const units = monthRecords.reduce((s, r) => s + r.units, 0)
      return { month, units }
    })
  }, [data])

  const insights = useMemo(() => {
    if (data.length === 0) return null
    const totalRevenue = data.reduce((s, r) => s + r.revenue, 0)
    const totalCost = data.reduce((s, r) => s + r.cost, 0)

    // Best month
    const monthRevenues = months.map((m) => ({
      month: m,
      revenue: data.filter((r) => r.month === m).reduce((s, r) => s + r.revenue, 0),
    }))
    const bestMonth = monthRevenues.reduce((a, b) => (a.revenue > b.revenue ? a : b))

    // Top product
    const prodMap = new Map<string, number>()
    data.forEach((r) => prodMap.set(r.product, (prodMap.get(r.product) || 0) + r.revenue))
    const topProduct = Array.from(prodMap.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))

    // Top region
    const regMap = new Map<string, number>()
    data.forEach((r) => regMap.set(r.region, (regMap.get(r.region) || 0) + r.revenue))
    const topRegion = Array.from(regMap.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))

    // Top rep
    const repMap = new Map<string, number>()
    data.forEach((r) => repMap.set(r.rep, (repMap.get(r.rep) || 0) + r.revenue))
    const topRep = Array.from(repMap.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))

    const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0

    return {
      bestMonth: { label: bestMonth.month, value: formatCurrency(bestMonth.revenue, currency) },
      topProduct: { label: topProduct[0], value: formatCurrency(topProduct[1], currency) },
      topRegion: { label: topRegion[0], value: formatCurrency(topRegion[1], currency) },
      topRep: { label: topRep[0], value: formatCurrency(topRep[1], currency) },
      margin: `${margin.toFixed(1)}%`,
    }
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <TrendingUp className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-xl text-foreground">No sales data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first sale to see the overview.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue vs Profit area chart */}
      <div className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-serif text-lg text-card-foreground">
          Monthly Revenue vs Profit
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_COLOR} stopOpacity={0.15} />
                <stop offset="95%" stopColor={REVENUE_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROFIT_COLOR} stopOpacity={0.15} />
                <stop offset="95%" stopColor={PROFIT_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e2dc" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => formatCurrency(v, currency)} />
            <Tooltip content={<ChartTooltipContent currency={currency} />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={REVENUE_COLOR}
              strokeWidth={2}
              fill="url(#revGrad)"
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke={PROFIT_COLOR}
              strokeWidth={2}
              fill="url(#profGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Product donut */}
        <div className="animate-fade-up-delay-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Revenue by Product
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {productData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value, currency)}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e2dc',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            {productData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-xs">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Units per month bar chart */}
        <div className="animate-fade-up-delay-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Units Sold per Month
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={unitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e2dc" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e2dc',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="units" name="Units" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Insights */}
      {insights && (
        <div className="animate-fade-up-delay-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Quick Insights
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[
              { icon: TrendingUp, label: 'Best Month', primary: insights.bestMonth.label, secondary: insights.bestMonth.value },
              { icon: Star, label: 'Top Product', primary: insights.topProduct.label, secondary: insights.topProduct.value },
              { icon: MapPin, label: 'Top Region', primary: insights.topRegion.label, secondary: insights.topRegion.value },
              { icon: User, label: 'Top Rep', primary: insights.topRep.label, secondary: insights.topRep.value },
              { icon: TrendingUp, label: 'Profit Margin', primary: insights.margin, secondary: 'overall' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <item.icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-card-foreground">{item.primary}</p>
                <p className="text-xs text-muted-foreground">{item.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
