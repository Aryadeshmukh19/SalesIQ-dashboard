'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { months } from '@/lib/industry-templates'
import type { SaleRecord } from '@/lib/types'

interface AddSaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (record: Omit<SaleRecord, 'id'>) => void
  regions: string[]
  products: string[]
  reps: string[]
  currency?: string
}

export function AddSaleDialog({
  open,
  onOpenChange,
  onSave,
  regions,
  products,
  reps,
  currency = '$',
}: AddSaleDialogProps) {
  const [form, setForm] = useState({
    month: '',
    region: '',
    product: '',
    rep: '',
    revenue: '',
    units: '',
    cost: '',
  })

  const canSave =
    form.month &&
    form.region &&
    form.product &&
    form.rep &&
    Number(form.revenue) > 0 &&
    Number(form.units) > 0 &&
    Number(form.cost) >= 0

  const handleSave = () => {
    if (!canSave) return
    onSave({
      month: form.month,
      region: form.region,
      product: form.product,
      rep: form.rep,
      revenue: Number(form.revenue),
      units: Number(form.units),
      cost: Number(form.cost),
    })
    setForm({
      month: '',
      region: '',
      product: '',
      rep: '',
      revenue: '',
      units: '',
      cost: '',
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-none shadow-2xl backdrop-blur-xl p-8">
        <DialogHeader className="mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">System Entry</span>
            <DialogTitle className="font-serif text-2xl font-bold tracking-tight">Record Transaction</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground/80 font-medium">
            Register a new sales record in the corporate registry.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-month" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Fiscal Period</Label>
              <Select
                value={form.month}
                onValueChange={(v) => setForm({ ...form, month: v })}
              >
                <SelectTrigger id="sale-month" className="w-full h-11 bg-muted/20 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-region" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Region</Label>
              <Select
                value={form.region}
                onValueChange={(v) => setForm({ ...form, region: v })}
              >
                <SelectTrigger id="sale-region" className="w-full h-11 bg-muted/20 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-product" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Category</Label>
              <Select
                value={form.product}
                onValueChange={(v) => setForm({ ...form, product: v })}
              >
                <SelectTrigger id="sale-product" className="w-full h-11 bg-muted/20 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-rep" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Executive</Label>
              <Select
                value={form.rep}
                onValueChange={(v) => setForm({ ...form, rep: v })}
              >
                <SelectTrigger id="sale-rep" className="w-full h-11 bg-muted/20 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/20">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {reps.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-revenue">Revenue ({currency})</Label>
              <Input
                id="sale-revenue"
                type="number"
                placeholder="50000"
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-units">Units</Label>
              <Input
                id="sale-units"
                type="number"
                placeholder="25"
                value={form.units}
                onChange={(e) => setForm({ ...form, units: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="sale-cost">Cost ({currency})</Label>
              <Input
                id="sale-cost"
                type="number"
                placeholder="30000"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="mt-8">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-11 rounded-xl font-bold uppercase tracking-widest text-[10px] text-muted-foreground">
            Discard
          </Button>
          <Button onClick={handleSave} disabled={!canSave} className="h-11 rounded-xl px-8 font-bold uppercase tracking-widest text-[11px] enterprise-shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
            Commit Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
