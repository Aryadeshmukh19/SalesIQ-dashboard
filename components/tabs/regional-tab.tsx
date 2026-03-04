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
import { formatCurrency, formatCurrencyFull, formatPercent } from '@/lib/format'
import { CHART_COLORS } from '@/lib/chart-colors'
import type { SaleRecord } from '@/lib/types'
import type { IndustryTemplate } from '@/lib/industry-templates'
import { MapPin } from 'lucide-react'
import { AddRegionalDataPanel } from '@/components/add-regional-data-panel'

interface RegionalTabProps {
  data: SaleRecord[]
  template: IndustryTemplate | null
  onAddSale: (record: Omit<SaleRecord, 'id'>) => Promise<void>
  currency?: string
}

export function RegionalTab({ data, template, onAddSale, currency = '$' }: RegionalTabProps) {
  const regionData = useMemo(() => {
    const map = new Map<string, number>()
    data.forEach((r) => map.set(r.region, (map.get(r.region) || 0) + r.revenue))
    const total = data.reduce((s, r) => s + r.revenue, 0)
    return Array.from(map.entries())
      .map(([name, value]) => ({
        name,
        value,
        percent: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  const maxRevenue = regionData.length > 0 ? regionData[0].value : 0

  if (data.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        {template && <AddRegionalDataPanel template={template} onAddSale={onAddSale} currency={currency} />}
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-serif text-xl text-foreground">No regional data yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the panel above to add your first regional sale.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {template && <AddRegionalDataPanel template={template} onAddSale={onAddSale} currency={currency} />}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pie chart */}
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Revenue by Region
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${formatPercent(percent)}`
                }
                labelLine={false}
              >
                {regionData.map((_, idx) => (
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
        </div>

        {/* Horizontal bar ranking */}
        <div className="animate-fade-up-delay-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 font-serif text-lg text-card-foreground">
            Region Ranking
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e2dc" />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(v) => formatCurrency(v, currency)}
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                width={100}
              />
              <Tooltip
                formatter={(value: number) => formatCurrencyFull(value)}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid #e5e2dc',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
              />
              <Bar dataKey="value" name="Revenue" fill="#2563eb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up-delay-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-serif text-lg text-card-foreground">
          Regional Breakdown
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left font-medium text-muted-foreground">Region</th>
                <th className="pb-3 text-right font-medium text-muted-foreground">Revenue</th>
                <th className="pb-3 text-right font-medium text-muted-foreground">Share</th>
                <th className="hidden pb-3 text-left font-medium text-muted-foreground md:table-cell">
                  <span className="ml-4">Performance</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {regionData.map((region, i) => (
                <tr
                  key={region.name}
                  className="border-b border-border/50 transition-colors hover:bg-muted/50"
                >
                  <td className="py-3 font-medium text-card-foreground">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                      />
                      {region.name}
                    </div>
                  </td>
                  <td className="py-3 text-right font-medium text-card-foreground">
                    {formatCurrency(region.value, currency)}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {formatPercent(region.percent)}
                  </td>
                  <td className="hidden py-3 md:table-cell">
                    <div className="ml-4 flex items-center gap-2">
                      <div className="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${maxRevenue > 0 ? (region.value / maxRevenue) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
