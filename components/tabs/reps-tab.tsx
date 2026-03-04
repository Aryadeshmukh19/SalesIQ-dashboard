'use client'

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency, formatCurrencyFull, formatPercent } from '@/lib/format'
import { REVENUE_COLOR, PROFIT_COLOR } from '@/lib/chart-colors'
import type { SaleRecord } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Users, Trophy } from 'lucide-react'

interface RepsTabProps {
  data: SaleRecord[]
  currency?: string
}

export function RepsTab({ data, currency = '$' }: RepsTabProps) {
  const repData = useMemo(() => {
    const map = new Map<string, { revenue: number; units: number; cost: number }>()
    data.forEach((r) => {
      const existing = map.get(r.rep) || { revenue: 0, units: 0, cost: 0 }
      map.set(r.rep, {
        revenue: existing.revenue + r.revenue,
        units: existing.units + r.units,
        cost: existing.cost + r.cost,
      })
    })
    return Array.from(map.entries())
      .map(([name, vals]) => ({
        name,
        ...vals,
        profit: vals.revenue - vals.cost,
        margin: vals.revenue > 0 ? ((vals.revenue - vals.cost) / vals.revenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [data])

  const topRepName = repData.length > 0 ? repData[0].name : ''

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-xl text-foreground">No rep data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add sales to see rep performance.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Grouped bar chart */}
      <div className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-serif text-lg text-card-foreground">
          Revenue vs Profit by Rep
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={repData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e2dc" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(v) => formatCurrency(v, currency)}
            />
            <Tooltip
              formatter={(value: number) => formatCurrencyFull(value, currency)}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e5e2dc',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}
            />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill={REVENUE_COLOR} radius={[4, 4, 0, 0]} />
            <Bar dataKey="profit" name="Profit" fill={PROFIT_COLOR} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rep scorecards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repData.map((rep) => (
          <div
            key={rep.name}
            className="animate-fade-up-delay-1 rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-medium text-card-foreground">{rep.name}</h4>
              {rep.name === topRepName && (
                <Badge className="gap-1 border-none bg-warning/15 text-warning">
                  <Trophy className="h-3 w-3" />
                  TOP
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-sm font-semibold text-card-foreground">
                  {formatCurrency(rep.revenue, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Profit</p>
                <p className="text-sm font-semibold text-success">
                  {formatCurrency(rep.profit, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Units</p>
                <p className="text-sm font-semibold text-card-foreground">
                  {rep.units.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Margin</p>
                <p className="text-sm font-semibold text-card-foreground">
                  {formatPercent(rep.margin)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
