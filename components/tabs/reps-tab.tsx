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
import { EmptyState } from '@/components/empty-state'

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
      <EmptyState
        icon={Users}
        title="No rep data yet"
        description="Add sales to see performance metrics for your sales representatives."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Grouped bar chart */}
      <div className="animate-fade-up glass-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Executive Performance Index
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Revenue Generation vs Profitability</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-primary">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-emerald-600">Profit</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={repData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis hide />
            <Tooltip
              formatter={(value: number) => formatCurrencyFull(value, currency)}
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={24} />
            <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Rep scorecards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repData.map((rep) => (
          <div
            key={rep.name}
            className="animate-fade-up glass-card group p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-bold text-card-foreground">{rep.name}</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Executive Agent</p>
                </div>
              </div>
              {rep.name === topRepName && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-600 uppercase tracking-widest border border-amber-500/20">
                  <Trophy className="h-3 w-3" />
                  Elite
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-y-5 gap-x-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Gross Intake</p>
                <p className="text-base font-bold text-card-foreground">
                  {formatCurrency(rep.revenue, currency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Net Yield</p>
                <p className="text-base font-bold text-emerald-600">
                  {formatCurrency(rep.profit, currency)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Unit Volume</p>
                <p className="text-base font-semibold text-card-foreground">
                  {rep.units.toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground">Units</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Efficiency</p>
                <p className="text-base font-semibold text-card-foreground">
                  {formatPercent(rep.margin)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                <span>Performance Delta</span>
                <span>{Math.round(rep.margin)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/30">
                <div
                  className="h-full rounded-full bg-primary/60 transition-all duration-1000 group-hover:bg-primary"
                  style={{ width: `${Math.max(5, rep.margin)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
