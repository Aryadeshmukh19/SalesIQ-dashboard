'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrencyFull } from '@/lib/format'
import type { SaleRecord } from '@/lib/types'
import { Pencil, Trash2, Check, X, Database } from 'lucide-react'

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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Database className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif text-xl text-foreground">No records yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first sale to see data here.
        </p>
      </div>
    )
  }

  return (
    <div className="animate-fade-up rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-serif text-lg text-card-foreground">
        All Sales Records ({data.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left font-medium text-muted-foreground">Month</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Region</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Product</th>
              <th className="pb-3 text-left font-medium text-muted-foreground">Rep</th>
              <th className="pb-3 text-right font-medium text-muted-foreground">Revenue</th>
              <th className="pb-3 text-right font-medium text-muted-foreground">Units</th>
              <th className="pb-3 text-right font-medium text-muted-foreground">Cost</th>
              <th className="pb-3 text-right font-medium text-muted-foreground">Profit</th>
              <th className="pb-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((record) => {
              const isEditing = editingId === record.id
              return (
                <tr
                  key={record.id}
                  className="border-b border-border/50 transition-colors hover:bg-muted/50"
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
                  <td className="py-2.5 text-right">
                    {isEditing ? (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={saveEdit}
                          className="h-7 w-7 p-0 text-success"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span className="sr-only">Save</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="h-7 w-7 p-0 text-muted-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="sr-only">Cancel</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEdit(record)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(record.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
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
