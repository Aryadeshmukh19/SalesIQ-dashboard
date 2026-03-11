'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import { formatCurrency, formatCurrencyFull } from '@/lib/format'
import { CHART_COLORS } from '@/lib/chart-colors'
import type { SaleRecord } from '@/lib/types'
import { Package } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

interface ProductsTabProps {
  data: SaleRecord[]
  currency?: string
}

export function ProductsTab({ data, currency = '$' }: ProductsTabProps) {
  const productData = useMemo(() => {
    const map = new Map<string, { revenue: number; units: number; cost: number }>()
    data.forEach((r) => {
      const existing = map.get(r.product) || { revenue: 0, units: 0, cost: 0 }
      map.set(r.product, {
        revenue: existing.revenue + r.revenue,
        units: existing.units + r.units,
        cost: existing.cost + r.cost,
      })
    })
    return Array.from(map.entries())
      .map(([name, vals]) => ({ name, ...vals, profit: vals.revenue - vals.cost }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [data])

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No product data yet"
        description="Add sales records to see which products are driving your revenue and profit."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Donut */}
        <div className="animate-fade-up glass-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Portfolio Revenue Distribution
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Asset Allocation Analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={4}
                dataKey="revenue"
                stroke="none"
              >
                {productData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value, currency)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
            {productData.map((p, i) => (
              <div key={p.name} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                {p.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bar comparison */}
        <div className="animate-fade-up-delay-1 glass-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Comparative Margin Analysis
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Revenue vs Operational Profit</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-20}
                textAnchor="end"
              />
              <YAxis
                hide
              />
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value, currency)}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Bar dataKey="revenue" name="Revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={20} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[6, 6, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Cards */}
      <div className="animate-fade-up-delay-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productData.map((product, i) => {
          const margin =
            product.revenue > 0
              ? ((product.profit / product.revenue) * 100).toFixed(1)
              : '0.0'
          return (
            <div
              key={product.name}
              className="glass-card group p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-2.5 w-2.5 rounded-full ring-4 ring-offset-2 ring-transparent group-hover:ring-current transition-all"
                    style={{
                      backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                      color: CHART_COLORS[i % CHART_COLORS.length] + '20'
                    }}
                  />
                  <h4 className="font-serif text-lg font-bold text-card-foreground">{product.name}</h4>
                </div>
                <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                  {margin}% Margin
                </div>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Gross Revenue</p>
                  <p className="text-base font-bold text-card-foreground">
                    {formatCurrency(product.revenue, currency)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Net Profit</p>
                  <p className="text-base font-bold text-emerald-600">
                    {formatCurrency(product.profit, currency)}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Volume Sold</p>
                  <p className="text-base font-semibold text-card-foreground">
                    {product.units.toLocaleString()} <span className="text-[10px] font-medium text-muted-foreground">Units</span>
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Unit Cost</p>
                  <p className="text-base font-semibold text-muted-foreground/80">
                    {formatCurrency(product.cost / (product.units || 1), currency)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
