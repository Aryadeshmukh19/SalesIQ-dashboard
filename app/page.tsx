'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Onboarding } from '@/components/onboarding'
import { DashboardHeader } from '@/components/dashboard-header'
import { Sidebar } from '@/components/sidebar'
import { KpiBar } from '@/components/kpi-bar'
import { AddSaleDialog } from '@/components/add-sale-dialog'
import { WelcomeGreeting } from '@/components/welcome-greeting'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useAuth } from '@/context/AuthContext'
import { industryTemplates } from '@/lib/industry-templates'
import { getRegionsForWorldRegion } from '@/lib/regions'
import { generateSeedData } from '@/lib/seed-data'
import {
  saveProfile,
  getProfile,
  saveSales,
  getSales,
  addSaleRecord,
  updateSaleRecord,
  deleteSaleRecord,
} from '@/lib/firebase/firestore'

// Dynamically import Tabs with glass-skeleton placeholders
const OverviewTab = dynamic(() => import('@/components/tabs/overview-tab').then(mod => mod.OverviewTab), {
  loading: () => <div className="h-96 w-full animate-pulse rounded-2xl glass-card flex items-center justify-center"><p className="text-muted-foreground/40 text-sm font-serif">Initializing Strategic View...</p></div>
})
const RegionalTab = dynamic(() => import('@/components/tabs/regional-tab').then(mod => mod.RegionalTab), {
  loading: () => <div className="h-96 w-full animate-pulse rounded-2xl glass-card" />
})
const ProductsTab = dynamic(() => import('@/components/tabs/products-tab').then(mod => mod.ProductsTab), {
  loading: () => <div className="h-96 w-full animate-pulse rounded-2xl glass-card" />
})
const RepsTab = dynamic(() => import('@/components/tabs/reps-tab').then(mod => mod.RepsTab), {
  loading: () => <div className="h-96 w-full animate-pulse rounded-2xl glass-card" />
})
const DataTab = dynamic(() => import('@/components/tabs/data-tab').then(mod => mod.DataTab), {
  loading: () => <div className="h-96 w-full animate-pulse rounded-2xl glass-card" />
})
const MarketingTab = dynamic(() => import('@/components/tabs/marketing-tab').then(mod => mod.MarketingTab), {
  loading: () => <div className="h-96 w-full animate-pulse rounded-2xl glass-card" />
})

import type { CompanyProfile, SaleRecord } from '@/lib/types'

function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [data, setData] = useState<SaleRecord[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [addSaleOpen, setAddSaleOpen] = useState(false)
  const [hydrating, setHydrating] = useState(true)
  const [showGreeting, setShowGreeting] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const greetingShown = useRef(false)

  // On mount, try to load existing data for the logged-in user
  useEffect(() => {
    if (!user) return
    async function load() {
      try {
        const [savedProfile, savedSales] = await Promise.all([
          getProfile(user!.uid),
          getSales(user!.uid),
        ])
        if (savedProfile) {
          setProfile(savedProfile)
          setData(savedSales)
          // Show greeting once per session
          if (!greetingShown.current) {
            greetingShown.current = true
            setShowGreeting(true)
          }
        }
      } finally {
        setHydrating(false)
      }
    }
    load()
  }, [user])

  const template = useMemo(() => {
    if (!profile) return null
    const base = industryTemplates[profile.industry] || industryTemplates['Custom']
    // Override regions with the user's chosen world region
    const dynamicRegions = getRegionsForWorldRegion(profile.worldRegion)
    return { ...base, regions: dynamicRegions }
  }, [profile])

  const handleOnboardingComplete = useCallback(
    async (p: CompanyProfile, regions: string[], useSampleData: boolean) => {
      const base = industryTemplates[p.industry] || industryTemplates['Custom']
      const templateWithRegions = { ...base, regions }
      const seedData = useSampleData ? generateSeedData(templateWithRegions) : []
      setProfile(p)
      setData(seedData)
      // Show greeting after onboarding
      if (!greetingShown.current) {
        greetingShown.current = true
        setShowGreeting(true)
      }
      // Persist to Firestore
      if (user) {
        await saveProfile(user.uid, p)
        await saveSales(user.uid, seedData)
      }
    },
    [user]
  )

  const handleAddSale = useCallback(
    async (record: Omit<SaleRecord, 'id'>) => {
      if (!user) return
      const firestoreId = await addSaleRecord(user.uid, record)
      setData((prev) => [...prev, { ...record, id: firestoreId }])
    },
    [user]
  )

  const handleUpdateSale = useCallback(
    async (id: string, updates: Partial<SaleRecord>) => {
      if (!user) return
      setData((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
      await updateSaleRecord(user.uid, id, updates)
    },
    [user]
  )

  const handleDeleteSale = useCallback(
    async (id: string) => {
      if (!user) return
      setData((prev) => prev.filter((r) => r.id !== id))
      await deleteSaleRecord(user.uid, id)
    },
    [user]
  )

  const currency = profile?.currency ?? '$'

  if (hydrating && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!profile) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 border-r border-border">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          companyName={profile.name}
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetContent side="left" className="p-0 w-64 border-none">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab)
                setShowMobileMenu(false)
              }}
              companyName={profile.name}
            />
          </SheetContent>
        </Sheet>
        {showGreeting && (
          <WelcomeGreeting
            user={user}
            onDismiss={() => setShowGreeting(false)}
          />
        )}

        <DashboardHeader
          onAddSale={() => setAddSaleOpen(true)}
          onMenuClick={() => setShowMobileMenu(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-8">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="flex flex-col gap-1">
              <h1 className="font-serif text-3xl font-semibold tracking-tight first-letter:capitalize">
                {activeTab} Analytics
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time performance metrics and insights for your enterprise.
              </p>
            </div>

            <KpiBar data={data} currency={currency} />

            <div className="animate-fade-up">
              {activeTab === 'overview' && <OverviewTab data={data} currency={currency} />}
              {activeTab === 'regional' && <RegionalTab data={data} currency={currency} template={template} onAddSale={handleAddSale} />}
              {activeTab === 'products' && <ProductsTab data={data} currency={currency} />}
              {activeTab === 'marketing' && <MarketingTab data={data} profile={profile} />}
              {activeTab === 'reps' && <RepsTab data={data} currency={currency} />}
              {activeTab === 'data' && (
                <DataTab
                  data={data}
                  currency={currency}
                  onUpdate={handleUpdateSale}
                  onDelete={handleDeleteSale}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {template && (
        <AddSaleDialog
          open={addSaleOpen}
          onOpenChange={setAddSaleOpen}
          onSave={handleAddSale}
          regions={template.regions}
          products={template.products}
          reps={template.reps}
          currency={currency}
        />
      )}
    </div>
  )
}

export default function Page() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  )
}
