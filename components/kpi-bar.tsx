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
} from 'lucide-react'

interface KpiBarProps {
  data: SaleRecord[]
  currency?: string
}

export function KpiBar({ data, currency = '$' }: KpiBarProps) {
  const metrics = useMemo(() => {
    const totalRevenue = data.reduce((s, r) => s + r.revenue, 0)
    const totalCost = data.reduce((s, r) => s + r.cost, 0)
    const totalProfit = totalRevenue - totalCost
    const totalUnits = data.reduce((s, r) => s + r.units, 0)
    const avgDeal = data.length > 0 ? totalRevenue / data.length : 0
    const margin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0

    return [
      {
        label: 'Total Revenue',
        value: formatCurrency(totalRevenue, currency),
        icon: DollarSign,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      },
      {
        label: 'Total Profit',
        value: formatCurrency(totalProfit, currency),
        suffix: formatPercent(margin),
        icon: TrendingUp,
        color: 'text-success',
        bgColor: 'bg-success/10',
      },
      {
        label: 'Total Units',
        value: formatNumber(totalUnits),
        icon: Package,
        color: 'text-warning',
        bgColor: 'bg-warning/10',
      },
      {
        label: 'Avg Deal Size',
        value: formatCurrency(avgDeal, currency),
        icon: BarChart2,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
      },
      {
        label: 'Total Cost',
        value: formatCurrency(totalCost, currency),
        icon: Wallet,
        color: 'text-destructive',
        bgColor: 'bg-destructive/10',
      },
    ]
  }, [data, currency])

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 lg:px-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`animate-fade-up flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm lg:p-4`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.bgColor}`}
            >
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">{m.label}</p>
              <p className="text-base font-semibold text-card-foreground lg:text-lg">
                {m.value}
              </p>
              {'suffix' in m && m.suffix && (
                <p className="text-xs font-medium text-success">{m.suffix} margin</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
