'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrencyFull } from '@/lib/format'
import type { SaleRecord } from '@/lib/types'
import { Pencil, Trash2, Check, X, Database } from 'lucide-react'
import { EmptyState } from '@/components/empty-state'

interface DataTabProps {
  data: SaleRecord[]
  currency?: string
  onUpdate: (id: string, record: Partial<SaleRecord>) => void
  onDelete: (id: string) => void
}

export function DataTab({ data, currency = '$', onUpdate, onDelete }: DataTabProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Partial<SaleRecord>>({})

  const startEdit = (record: SaleRecord) => {
    setEditingId(record.id)
    setEditValues({ ...record })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditValues({})
  }

  const saveEdit = () => {
    if (editingId) {
      onUpdate(editingId, editValues)
      setEditingId(null)
      setEditValues({})
    }
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="No records yet"
        description="Add your first sale record to start building your database and see insights."
      />
    )
  }

  return (
    <div className="animate-fade-up glass-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-bold text-card-foreground">
            Centralized Sales Records
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Full Transaction History — {data.length} Records</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="pb-4 text-left font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60 w-24">Month</th>
              <th className="pb-4 text-left font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Region</th>
              <th className="pb-4 text-left font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Product</th>
              <th className="pb-4 text-left font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Rep</th>
              <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Revenue</th>
              <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Units</th>
              <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Cost</th>
              <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Profit</th>
              <th className="pb-4 text-right font-bold uppercase tracking-tighter text-[10px] text-muted-foreground/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => {
              const isEditing = editingId === record.id
              return (
                <tr
                  key={record.id}
                  className="group border-b border-border/30 transition-all duration-200 hover:bg-muted/30"
                >
                  <td className="py-2.5 text-card-foreground">
                    {isEditing ? (
                      <Input
                        value={editValues.month || ''}
                        onChange={(e) =>
                          setEditValues({ ...editValues, month: e.target.value })
                        }
                        className="h-7 w-16 text-xs"
                      />
                    ) : (
                      record.month
                    )}
                  </td>
                  <td className="py-2.5 text-card-foreground">
                    {isEditing ? (
                      <Input
                        value={editValues.region || ''}
                        onChange={(e) =>
                          setEditValues({ ...editValues, region: e.target.value })
                        }
                        className="h-7 w-24 text-xs"
                      />
                    ) : (
                      record.region
                    )}
                  </td>
                  <td className="py-2.5 text-card-foreground">
                    {isEditing ? (
                      <Input
                        value={editValues.product || ''}
                        onChange={(e) =>
                          setEditValues({ ...editValues, product: e.target.value })
                        }
                        className="h-7 w-24 text-xs"
                      />
                    ) : (
                      record.product
                    )}
                  </td>
                  <td className="py-2.5 text-card-foreground">
                    {isEditing ? (
                      <Input
                        value={editValues.rep || ''}
                        onChange={(e) =>
                          setEditValues({ ...editValues, rep: e.target.value })
                        }
                        className="h-7 w-24 text-xs"
                      />
                    ) : (
                      record.rep
                    )}
                  </td>
                  <td className="py-2.5 text-right font-medium text-card-foreground">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.revenue || 0}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            revenue: Number(e.target.value),
                          })
                        }
                        className="h-7 w-20 text-right text-xs"
                      />
                    ) : (
                      formatCurrencyFull(record.revenue, currency)
                    )}
                  </td>
                  <td className="py-2.5 text-right text-card-foreground">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.units || 0}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            units: Number(e.target.value),
                          })
                        }
                        className="h-7 w-16 text-right text-xs"
                      />
                    ) : (
                      record.units
                    )}
                  </td>
                  <td className="py-2.5 text-right text-destructive">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editValues.cost || 0}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            cost: Number(e.target.value),
                          })
                        }
                        className="h-7 w-20 text-right text-xs"
                      />
                    ) : (
                      formatCurrencyFull(record.cost, currency)
                    )}
                  </td>
                  <td className="py-2.5 text-right font-medium text-success">
                    {formatCurrencyFull(
                      (isEditing ? editValues.revenue || 0 : record.revenue) -
                      (isEditing ? editValues.cost || 0 : record.cost),
                      currency
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={saveEdit}
                          className="h-8 w-8 p-0 text-emerald-500 hover:bg-emerald-500/10 rounded-lg"
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-8 w-8 p-0 text-muted-foreground hover:bg-muted/50 rounded-lg"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(record)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(record.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-lg"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
