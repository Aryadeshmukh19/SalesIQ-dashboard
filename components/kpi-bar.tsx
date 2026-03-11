'use client'

import { useMemo } from 'react'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import type { SaleRecord } from '@/lib/types'
import {
  DollarSign,
  TrendingUp,
  Package,
  BarChart2,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts'

interface KpiBarProps {
  data: SaleRecord[]
  currency?: string
}

const MONTH_ORDER: Record<string, number> = {
  'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
  'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
}

function Sparkline({ data, color }: { data: any[], color: string }) {
  return (
    <div className="h-8 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
          <YAxis hide domain={['dataMin', 'dataMax']} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function KpiBar({ data, currency = '$' }: KpiBarProps) {
  const metrics = useMemo(() => {
    const totalRevenue = data.reduce((s, r) => s + r.revenue, 0)
    const totalCost = data.reduce((s, r) => s + r.cost, 0)
    const totalProfit = totalRevenue - totalCost
    const totalUnits = data.reduce((s, r) => s + r.units, 0)
    const avgDeal = data.length > 0 ? totalRevenue / data.length : 0
    const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    // Prepare trend data
    const trendData = [...data].sort((a, b) => (MONTH_ORDER[a.month] ?? 0) - (MONTH_ORDER[b.month] ?? 0))
    const revenueTrend = trendData.slice(-7).map((r, i) => ({ value: r.revenue, id: i }))
    const profitTrend = trendData.slice(-7).map((r, i) => ({ value: r.revenue - r.cost, id: i }))
    const unitsTrend = trendData.slice(-7).map((r, i) => ({ value: r.units, id: i }))

    return [
      {
        label: 'Revenue',
        value: formatCurrency(totalRevenue, currency),
        icon: DollarSign,
        color: '#3b82f6',
        trend: revenueTrend,
        change: '+12.5%',
        isUp: true
      },
      {
        label: 'Profit',
        value: formatCurrency(totalProfit, currency),
        suffix: `${formatPercent(margin)} margin`,
        icon: TrendingUp,
        color: '#10b981',
        trend: profitTrend,
        change: '+8.2%',
        isUp: true
      },
      {
        label: 'Units Sold',
        value: formatNumber(totalUnits),
        icon: Package,
        color: '#f59e0b',
        trend: unitsTrend,
        change: '-2.4%',
        isUp: false
      },
      {
        label: 'Avg Deal',
        value: formatCurrency(avgDeal, currency),
        icon: BarChart2,
        color: '#6366f1',
        trend: revenueTrend,
        change: '+4.1%',
        isUp: true
      },
      {
        label: 'Op. Cost',
        value: formatCurrency(totalCost, currency),
        icon: Wallet,
        color: '#ef4444',
        trend: revenueTrend.map(v => ({ ...v, value: v.value * 0.4 })),
        change: '+5.3%',
        isUp: false
      },
    ]
  }, [data, currency])

  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-5">
      {metrics.map((m, i) => (
        <div
          key={m.label}
          className="group animate-fade-up relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg lg:p-5 dark:hover:bg-sidebar-accent/50"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-muted/50 transition-colors group-hover:bg-background`}>
              <m.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <Sparkline data={m.trend} color={m.color} />
          </div>

          <div className="mt-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{m.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight">{m.value}</h3>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <div className={`flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold ${m.isUp ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                }`}>
                {m.isUp ? <ArrowUpRight className="mr-0.5 h-3 w-3" /> : <ArrowDownRight className="mr-0.5 h-3 w-3" />}
                {m.change}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">vs last month</span>
            </div>
          </div>

          {'suffix' in m && m.suffix && (
            <div className="absolute top-4 right-4 text-[10px] font-bold text-emerald-500 opacity-0 transition-opacity group-hover:opacity-100 italic">
              {m.suffix}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
