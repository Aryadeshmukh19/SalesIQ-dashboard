'use client'

import { LucideIcon, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center animate-fade-in">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-xl font-semibold text-foreground">{title}</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-6 gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}
