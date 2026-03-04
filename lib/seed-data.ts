import { months } from './industry-templates'
import type { IndustryTemplate } from './industry-templates'
import type { SaleRecord } from './types'

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function generateSeedData(template: IndustryTemplate): SaleRecord[] {
  const records: SaleRecord[] = []
  const rand = seededRandom(42)
  let id = 1

  for (const month of months) {
    const numSales = 3 + Math.floor(rand() * 4)
    for (let i = 0; i < numSales; i++) {
      const product = template.products[Math.floor(rand() * template.products.length)]
      const region = template.regions[Math.floor(rand() * template.regions.length)]
      const rep = template.reps[Math.floor(rand() * template.reps.length)]
      const revenue = Math.round((10000 + rand() * 90000) / 100) * 100
      const units = Math.round(5 + rand() * 95)
      const margin = 0.25 + rand() * 0.45
      const cost = Math.round(revenue * (1 - margin) / 100) * 100

      records.push({
        id: String(id++),
        month,
        region,
        product,
        rep,
        revenue,
        units,
        cost,
      })
    }
  }

  return records
}
