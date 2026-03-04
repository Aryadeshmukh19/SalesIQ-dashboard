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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-xl text-foreground">No product data yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add sales to see product breakdowns.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Donut */}
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Revenue Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={110}
                paddingAngle={3}
                dataKey="revenue"
              >
                {productData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={CHART_COLORS[idx % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value)}
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

        {/* Bar comparison */}
        <div className="animate-fade-up-delay-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Product Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
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
              <Bar dataKey="revenue" name="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
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
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                />
                <h4 className="font-medium text-card-foreground">{product.name}</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-sm font-semibold text-card-foreground">
                    {formatCurrency(product.revenue, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Profit</p>
                  <p className="text-sm font-semibold text-success">
                    {formatCurrency(product.profit, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Units</p>
                  <p className="text-sm font-semibold text-card-foreground">
                    {product.units.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Margin</p>
                  <p className="text-sm font-semibold text-card-foreground">{margin}%</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
