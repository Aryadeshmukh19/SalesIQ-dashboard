export function formatCurrency(value: number, currency = '$', locale = 'en-US'): string {
  if (value >= 1_000_000) {
    return `${currency}${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${currency}${(value / 1_000).toFixed(value >= 100_000 ? 0 : 1)}K`
  }
  return `${currency}${value.toLocaleString(locale)}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString()
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function formatCurrencyFull(value: number, currency = '$', locale = 'en-US'): string {
  return `${currency}${value.toLocaleString(locale)}`
}
