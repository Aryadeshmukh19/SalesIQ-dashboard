export interface WorldRegion {
    currency: string
    currencyCode: string
    locale: string
    flag: string
    regions: string[]
}

export const WORLD_REGIONS: Record<string, WorldRegion> = {
    India: {
        currency: '₹',
        currencyCode: 'INR',
        locale: 'en-IN',
        flag: '🇮🇳',
        regions: [
            'Maharashtra',
            'Delhi NCR',
            'Karnataka',
            'Tamil Nadu',
            'Gujarat',
            'Rajasthan',
            'Uttar Pradesh',
            'West Bengal',
            'Telangana',
            'Kerala',
            'Punjab',
            'Haryana',
        ],
    },
    USA: {
        currency: '$',
        currencyCode: 'USD',
        locale: 'en-US',
        flag: '🇺🇸',
        regions: [
            'California',
            'Texas',
            'New York',
            'Florida',
            'Illinois',
            'Pennsylvania',
            'Ohio',
            'Georgia',
            'North Carolina',
            'Michigan',
            'Washington',
            'Arizona',
        ],
    },
    Europe: {
        currency: '€',
        currencyCode: 'EUR',
        locale: 'de-DE',
        flag: '🇪🇺',
        regions: [
            'Germany',
            'France',
            'Spain',
            'Italy',
            'Netherlands',
            'Poland',
            'Belgium',
            'Sweden',
            'Austria',
            'Denmark',
            'Portugal',
            'Finland',
        ],
    },
    UK: {
        currency: '£',
        currencyCode: 'GBP',
        locale: 'en-GB',
        flag: '🇬🇧',
        regions: [
            'England – London',
            'England – South East',
            'England – North West',
            'England – Yorkshire',
            'Scotland',
            'Wales',
            'Northern Ireland',
            'England – East of England',
            'England – West Midlands',
            'England – East Midlands',
            'England – South West',
            'England – North East',
        ],
    },
    'Southeast Asia': {
        currency: '$',
        currencyCode: 'USD',
        locale: 'en-US',
        flag: '🌏',
        regions: [
            'Singapore',
            'Malaysia',
            'Indonesia',
            'Thailand',
            'Vietnam',
            'Philippines',
            'Myanmar',
            'Cambodia',
            'Laos',
            'Brunei',
        ],
    },
    'Middle East': {
        currency: 'AED',
        currencyCode: 'AED',
        locale: 'ar-AE',
        flag: '🌍',
        regions: [
            'UAE',
            'Saudi Arabia',
            'Qatar',
            'Kuwait',
            'Bahrain',
            'Oman',
            'Egypt',
            'Jordan',
            'Lebanon',
            'Turkey',
        ],
    },
    Canada: {
        currency: 'CA$',
        currencyCode: 'CAD',
        locale: 'en-CA',
        flag: '🇨🇦',
        regions: [
            'Ontario',
            'British Columbia',
            'Quebec',
            'Alberta',
            'Manitoba',
            'Saskatchewan',
            'Nova Scotia',
            'New Brunswick',
            'Newfoundland',
            'Prince Edward Island',
        ],
    },
    Australia: {
        currency: 'A$',
        currencyCode: 'AUD',
        locale: 'en-AU',
        flag: '🇦🇺',
        regions: [
            'New South Wales',
            'Victoria',
            'Queensland',
            'Western Australia',
            'South Australia',
            'Tasmania',
            'ACT',
            'Northern Territory',
        ],
    },
    Custom: {
        currency: '$',
        currencyCode: 'USD',
        locale: 'en-US',
        flag: '🌐',
        regions: [
            'Region A',
            'Region B',
            'Region C',
            'Region D',
            'Region E',
            'Region F',
            'Region G',
            'Region H',
        ],
    },
}

export const worldRegionNames = Object.keys(WORLD_REGIONS)

/** Derive template regions from the user's world region choice */
export function getRegionsForWorldRegion(worldRegion: string): string[] {
    return WORLD_REGIONS[worldRegion]?.regions ?? WORLD_REGIONS['Custom'].regions
}

export function getCurrencyForWorldRegion(worldRegion: string): string {
    return WORLD_REGIONS[worldRegion]?.currency ?? '$'
}

export function getLocaleForWorldRegion(worldRegion: string): string {
    return WORLD_REGIONS[worldRegion]?.locale ?? 'en-US'
}
