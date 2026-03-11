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
import { EmptyState } from '@/components/empty-state'

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
        <EmptyState
          icon={MapPin}
          title="No regional data yet"
          description="Use the panel above to add your first regional sale and see geographic performance."
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {template && <AddRegionalDataPanel template={template} onAddSale={onAddSale} currency={currency} />}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pie chart */}
        <div className="animate-fade-up glass-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Geographic Revenue Distribution
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Global Market Share Analysis</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {regionData.map((_, idx) => (
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
                  padding: '12px',
                }}
                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Horizontal bar ranking */}
        <div className="animate-fade-up-delay-1 glass-card p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-serif text-lg font-bold text-card-foreground">
              Regional Performance Ranking
            </h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Ranked by Total Revenue Contribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionData} layout="vertical" margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
              <XAxis
                type="number"
                hide
              />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                width={100}
                axisLine={false}
                tickLine={false}
              />
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
              <Bar
                dataKey="value"
                name="Revenue"
                fill="var(--primary)"
                radius={[0, 8, 8, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-up-delay-2 glass-card p-6 shadow-sm">
        <div className="mb-6">
          <h3 className="font-serif text-lg font-bold text-card-foreground">
            Regional Breakdown
          </h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Detailed market penetration metrics</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="pb-4 text-left font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Region</th>
                <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Revenue</th>
                <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Market Share</th>
                <th className="hidden pb-4 text-left font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60 md:table-cell">
                  <span className="ml-4">Intensity</span>
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
