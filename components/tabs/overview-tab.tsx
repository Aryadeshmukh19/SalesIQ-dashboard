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
import { CHART_COLORS, REVENUE_COLOR, PROFIT_COLOR, UNITS_COLOR } from '@/lib/chart-colors'
import { months } from '@/lib/industry-templates'
import type { SaleRecord } from '@/lib/types'
import { TrendingUp, Star, MapPin, User, BarChart3 } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

interface OverviewTabProps {
  data: SaleRecord[]
  currency?: string
}

function ChartTooltipContent({ active, payload, label, currency = '$' }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; currency?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card border-none p-3 shadow-xl backdrop-blur-md">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full ring-2 ring-white/20"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
            </div>
            <span className="font-bold text-card-foreground">
              {formatCurrencyFull(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
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
      <EmptyState
        icon={BarChart3}
        title="No sales data yet"
        description="Connect your sales data or add your first record manually to see the overview."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Revenue vs Profit area chart */}
      <div className="animate-fade-up glass-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Performance Overview
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Monthly Revenue vs Profit</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: REVENUE_COLOR }} />
              <span className="text-xs font-medium text-muted-foreground uppercase">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PROFIT_COLOR }} />
              <span className="text-xs font-medium text-muted-foreground uppercase">Profit</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={REVENUE_COLOR} stopOpacity={0.2} />
                <stop offset="95%" stopColor={REVENUE_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PROFIT_COLOR} stopOpacity={0.2} />
                <stop offset="95%" stopColor={PROFIT_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              tickFormatter={(v) => formatCurrency(v, currency)}
            />
            <Tooltip
              content={<ChartTooltipContent currency={currency} />}
              cursor={{ stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={REVENUE_COLOR}
              strokeWidth={3}
              fill="url(#revGrad)"
              activeDot={{ r: 6, strokeWidth: 0, fill: REVENUE_COLOR }}
            />
            <Area
              type="monotone"
              dataKey="profit"
              name="Profit"
              stroke={PROFIT_COLOR}
              strokeWidth={3}
              fill="url(#profGrad)"
              activeDot={{ r: 6, strokeWidth: 0, fill: PROFIT_COLOR }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Revenue by Product donut */}
        <div className="animate-fade-up-delay-1 glass-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Market Distribution
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Revenue by Product Line</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={105}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {productData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    className="hover:opacity-80 transition-opacity duration-300"
                  />
                ))}
              </Pie>
              <Tooltip
                content={<ChartTooltipContent currency={currency} />}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {productData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Units per month bar chart */}
        <div className="animate-fade-up-delay-2 glass-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Volume Analysis
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Units Sold Consistency</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={unitsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
              />
              <Tooltip
                content={<ChartTooltipContent currency={currency} />}
                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              />
              <Bar
                dataKey="units"
                name="Units"
                fill={UNITS_COLOR}
                radius={[6, 6, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Insights */}
      {insights && (
        <div className="animate-fade-up-delay-3 glass-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Strategic Insights
            </h3>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Automated Performance Breakdown</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {[
              { icon: TrendingUp, label: 'High Performance', primary: insights.bestMonth.label, secondary: 'Peak Revenue Month', color: 'text-emerald-500' },
              { icon: Star, label: 'Flagship Product', primary: insights.topProduct.label, secondary: 'Top Revenue Contributor', color: 'text-amber-500' },
              { icon: MapPin, label: 'Core Market', primary: insights.topRegion.label, secondary: 'Dominant Sales Region', color: 'text-blue-500' },
              { icon: User, label: 'Star Performer', primary: insights.topRep.label, secondary: 'Leading Sales Representative', color: 'text-indigo-500' },
              { icon: BarChart3, label: 'Capital Efficiency', primary: insights.margin, secondary: 'Net Profit Margin', color: 'text-violet-500' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col gap-2 group cursor-default">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-muted/50 transition-colors duration-300 group-hover:bg-primary/10 ${item.color.replace('text', 'bg').replace('500', '500/10')}`}>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
                </div>
                <div>
                  <p className="text-base font-bold text-card-foreground tracking-tight">{item.primary}</p>
                  <p className="text-[10px] text-muted-foreground font-medium">{item.secondary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
