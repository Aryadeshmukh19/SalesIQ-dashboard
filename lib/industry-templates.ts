export interface IndustryTemplate {
  products: string[]
  regions: string[]
  reps: string[]
}

// Note: regions are now populated dynamically from the user's chosen world region.
// These placeholder arrays are overridden in page.tsx using getRegionsForWorldRegion().
const placeholderRegions = ['Region A', 'Region B', 'Region C', 'Region D', 'Region E']

export const industryTemplates: Record<string, IndustryTemplate> = {
  'E-Commerce': {
    products: ['Electronics', 'Apparel', 'Home & Garden', 'Beauty', 'Sports'],
    regions: placeholderRegions,
    reps: ['Sarah Chen', 'James Wilson', 'Maria Garcia', 'Alex Thompson', 'Lisa Park'],
  },
  'SaaS/Tech': {
    products: ['Enterprise Plan', 'Pro Plan', 'Starter Plan', 'Add-ons', 'Professional Services'],
    regions: placeholderRegions,
    reps: ['David Kim', 'Rachel Green', 'Tom Bradley', 'Nina Patel', 'Chris Morgan'],
  },
  'Retail': {
    products: ['In-Store', 'Online', 'Wholesale', 'Private Label', 'Seasonal'],
    regions: placeholderRegions,
    reps: ['Mike Johnson', 'Emily Davis', 'Robert Lee', 'Amanda Foster', 'Kevin White'],
  },
  'Manufacturing': {
    products: ['Raw Materials', 'Components', 'Finished Goods', 'Custom Orders', 'Maintenance'],
    regions: placeholderRegions,
    reps: ['John Smith', 'Patricia Brown', 'Richard Taylor', 'Jennifer Martinez', 'William Anderson'],
  },
  'Healthcare': {
    products: ['Medical Devices', 'Pharmaceuticals', 'Diagnostics', 'Telehealth', 'Consulting'],
    regions: placeholderRegions,
    reps: ['Dr. Sarah Mitchell', 'Mark Stevens', 'Laura Chen', 'Daniel Rivera', 'Karen Hughes'],
  },
  'Financial Services': {
    products: ['Wealth Management', 'Insurance', 'Lending', 'Advisory', 'Trading'],
    regions: placeholderRegions,
    reps: ['Andrew Clarke', 'Michelle Wong', 'Brian Thompson', 'Jessica Adams', 'Paul Robinson'],
  },
  'Custom': {
    products: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    regions: placeholderRegions,
    reps: ['Rep Alpha', 'Rep Beta', 'Rep Gamma', 'Rep Delta', 'Rep Epsilon'],
  },
}

export const industries = Object.keys(industryTemplates)

export const businessModels = ['B2B', 'B2C', 'B2B2C', 'D2C', 'Marketplace', 'Subscription']

export const teamSizes = ['1-10', '11-50', '51-200', '200+']

export const growthGoals = [
  'Acquire new customers',
  'Retain & upsell',
  'Expand to new markets',
  'Move upmarket',
  'Launch new product',
]

export const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
