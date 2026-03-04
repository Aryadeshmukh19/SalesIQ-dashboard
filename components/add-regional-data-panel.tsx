'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { ChevronDown, ChevronUp, Plus, Upload, FileText, X, Download, CheckCircle } from 'lucide-react'
import { months } from '@/lib/industry-templates'
import type { SaleRecord } from '@/lib/types'
import type { IndustryTemplate } from '@/lib/industry-templates'

interface AddRegionalDataPanelProps {
    template: IndustryTemplate
    onAddSale: (record: Omit<SaleRecord, 'id'>) => Promise<void>
    currency?: string
}

type TabMode = 'manual' | 'csv'

interface ParsedRow {
    month: string
    region: string
    product: string
    rep: string
    revenue: number
    units: number
    cost: number
    valid: boolean
    error?: string
}

const emptyForm = {
    month: '',
    region: '',
    product: '',
    rep: '',
    revenue: '',
    units: '',
    cost: '',
}

function parseCsv(text: string, regions: string[], products: string[]): ParsedRow[] {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return []
    // skip header
    return lines.slice(1).map((line) => {
        const cols = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
        const [month, region, product, rep, revenueStr, unitsStr, costStr] = cols
        const revenue = parseFloat(revenueStr)
        const units = parseInt(unitsStr, 10)
        const cost = parseFloat(costStr)

        const errors: string[] = []
        if (!months.includes(month)) errors.push(`Invalid month "${month}"`)
        if (!region) errors.push('Missing region')
        if (!product) errors.push('Missing product')
        if (!rep) errors.push('Missing rep')
        if (isNaN(revenue) || revenue <= 0) errors.push('Invalid revenue')
        if (isNaN(units) || units <= 0) errors.push('Invalid units')
        if (isNaN(cost) || cost < 0) errors.push('Invalid cost')

        return {
            month: month || '',
            region: region || '',
            product: product || '',
            rep: rep || '',
            revenue: isNaN(revenue) ? 0 : revenue,
            units: isNaN(units) ? 0 : units,
            cost: isNaN(cost) ? 0 : cost,
            valid: errors.length === 0,
            error: errors.join('; '),
        }
    })
}

const SAMPLE_CSV = `month,region,product,rep,revenue,units,cost
Jan,Maharashtra,Product A,Rep Alpha,150000,30,90000
Feb,Karnataka,Product B,Rep Beta,220000,45,130000
Mar,Delhi NCR,Product C,Rep Gamma,180000,38,100000`

function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'regional_sales_template.csv'
    a.click()
    URL.revokeObjectURL(url)
}

export function AddRegionalDataPanel({ template, onAddSale, currency = '₹' }: AddRegionalDataPanelProps) {
    const [tab, setTab] = useState<TabMode>('csv')

    // --- Manual entry state ---
    const [form, setForm] = useState(emptyForm)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    const canSave =
        form.month &&
        form.region &&
        form.product &&
        form.rep &&
        Number(form.revenue) > 0 &&
        Number(form.units) > 0 &&
        Number(form.cost) >= 0

    const handleManualSave = async () => {
        if (!canSave) return
        setSaving(true)
        await onAddSale({
            month: form.month,
            region: form.region,
            product: form.product,
            rep: form.rep,
            revenue: Number(form.revenue),
            units: Number(form.units),
            cost: Number(form.cost),
        })
        setSaving(false)
        setSaved(true)
        setForm(emptyForm)
        setTimeout(() => setSaved(false), 2000)
    }

    // --- CSV state ---
    const fileRef = useRef<HTMLInputElement>(null)
    const [dragging, setDragging] = useState(false)
    const [csvRows, setCsvRows] = useState<ParsedRow[]>([])
    const [csvFileName, setCsvFileName] = useState('')
    const [importing, setImporting] = useState(false)
    const [importDone, setImportDone] = useState(false)

    const handleFile = useCallback(
        (file: File) => {
            if (!file.name.endsWith('.csv')) return
            setCsvFileName(file.name)
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target?.result as string
                const rows = parseCsv(text, template.regions, template.products)
                setCsvRows(rows)
                setImportDone(false)
            }
            reader.readAsText(file)
        },
        [template.regions, template.products]
    )

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragging(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }

    const validRows = csvRows.filter((r) => r.valid)

    const handleImport = async () => {
        if (validRows.length === 0) return
        setImporting(true)
        for (const row of validRows) {
            await onAddSale({
                month: row.month,
                region: row.region,
                product: row.product,
                rep: row.rep,
                revenue: row.revenue,
                units: row.units,
                cost: row.cost,
            })
        }
        setImporting(false)
        setImportDone(true)
        setCsvRows([])
        setCsvFileName('')
        setTimeout(() => setImportDone(false), 3000)
    }

    return (
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden mb-6">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <Plus className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-semibold text-card-foreground">Add Sales Data</span>
                </div>
                {/* Tab switcher */}
                <div className="flex gap-1 bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setTab('csv')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'csv'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        📁 CSV Upload
                    </button>
                    <button
                        onClick={() => setTab('manual')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${tab === 'manual'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        ✏️ Manual Entry
                    </button>
                </div>
            </div>

            <div className="px-6 pb-6 pt-4">
                {/* ── MANUAL ENTRY ── */}
                {tab === 'manual' && (
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {/* Month */}
                            <div className="flex flex-col gap-1.5">
                                <Label>Month</Label>
                                <Select value={form.month} onValueChange={(v) => setForm({ ...form, month: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((m) => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Region */}
                            <div className="flex flex-col gap-1.5">
                                <Label>State / Region</Label>
                                <Select value={form.region} onValueChange={(v) => setForm({ ...form, region: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {template.regions.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Product */}
                            <div className="flex flex-col gap-1.5">
                                <Label>Product</Label>
                                <Select value={form.product} onValueChange={(v) => setForm({ ...form, product: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {template.products.map((p) => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Rep */}
                            <div className="flex flex-col gap-1.5">
                                <Label>Sales Rep</Label>
                                <Select value={form.rep} onValueChange={(v) => setForm({ ...form, rep: v })}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {template.reps.map((r) => (
                                            <SelectItem key={r} value={r}>{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <Label>Revenue ({currency})</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 150000"
                                    value={form.revenue}
                                    onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Units Sold</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 30"
                                    value={form.units}
                                    onChange={(e) => setForm({ ...form, units: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label>Cost ({currency})</Label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 90000"
                                    value={form.cost}
                                    onChange={(e) => setForm({ ...form, cost: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button onClick={handleManualSave} disabled={!canSave || saving} className="gap-2">
                                {saving ? (
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : saved ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                {saving ? 'Saving…' : saved ? 'Saved!' : 'Add Entry'}
                            </Button>
                            {saved && (
                                <span className="text-sm text-green-600 font-medium">
                                    ✓ Entry added to regional data
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── CSV UPLOAD ── */}
                {tab === 'csv' && (
                    <div className="flex flex-col gap-4">
                        {/* Drop zone */}
                        {csvRows.length === 0 && (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                onClick={() => fileRef.current?.click()}
                                className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${dragging
                                        ? 'border-primary bg-primary/5'
                                        : 'border-border hover:border-primary/50 hover:bg-muted/30'
                                    }`}
                            >
                                <Upload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                                <p className="font-medium text-card-foreground">
                                    Drag &amp; drop your CSV here, or{' '}
                                    <span className="text-primary underline">browse</span>
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Columns: month, region, product, rep, revenue, units, cost
                                </p>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".csv"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0]
                                        if (f) handleFile(f)
                                        e.target.value = ''
                                    }}
                                />
                            </div>
                        )}

                        {/* Download sample */}
                        {csvRows.length === 0 && (
                            <button
                                onClick={downloadSample}
                                className="flex items-center gap-2 text-sm text-primary hover:underline w-fit"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download sample CSV template
                            </button>
                        )}

                        {/* Preview */}
                        {csvRows.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium text-card-foreground">{csvFileName}</span>
                                        <span className="text-xs text-muted-foreground">
                                            ({validRows.length}/{csvRows.length} valid rows)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => { setCsvRows([]); setCsvFileName('') }}
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="overflow-x-auto rounded-lg border border-border max-h-52 overflow-y-auto">
                                    <table className="w-full text-xs">
                                        <thead className="bg-muted sticky top-0">
                                            <tr>
                                                {['Month', 'Region', 'Product', 'Rep', `Revenue ${currency}`, 'Units', `Cost ${currency}`, 'Status'].map(
                                                    (h) => (
                                                        <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">
                                                            {h}
                                                        </th>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {csvRows.map((row, i) => (
                                                <tr
                                                    key={i}
                                                    className={`border-t border-border/50 ${row.valid ? '' : 'bg-destructive/5'}`}
                                                >
                                                    <td className="px-3 py-1.5">{row.month}</td>
                                                    <td className="px-3 py-1.5">{row.region}</td>
                                                    <td className="px-3 py-1.5">{row.product}</td>
                                                    <td className="px-3 py-1.5">{row.rep}</td>
                                                    <td className="px-3 py-1.5">{row.revenue.toLocaleString()}</td>
                                                    <td className="px-3 py-1.5">{row.units}</td>
                                                    <td className="px-3 py-1.5">{row.cost.toLocaleString()}</td>
                                                    <td className="px-3 py-1.5">
                                                        {row.valid ? (
                                                            <span className="text-green-600 font-medium">✓</span>
                                                        ) : (
                                                            <span className="text-destructive text-[10px]" title={row.error}>
                                                                ✗ {row.error}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <Button
                                        onClick={handleImport}
                                        disabled={validRows.length === 0 || importing}
                                        className="gap-2"
                                    >
                                        {importing ? (
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        ) : (
                                            <Upload className="h-4 w-4" />
                                        )}
                                        {importing
                                            ? 'Importing…'
                                            : `Import ${validRows.length} row${validRows.length !== 1 ? 's' : ''}`}
                                    </Button>
                                    {importDone && (
                                        <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                            <CheckCircle className="h-3.5 w-3.5" /> Import complete!
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
