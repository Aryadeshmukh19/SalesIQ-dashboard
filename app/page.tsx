'use client'

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { Onboarding } from '@/components/onboarding'
import { DashboardHeader } from '@/components/dashboard-header'
import { KpiBar } from '@/components/kpi-bar'
import { AddSaleDialog } from '@/components/add-sale-dialog'
import { OverviewTab } from '@/components/tabs/overview-tab'
import { RegionalTab } from '@/components/tabs/regional-tab'
import { ProductsTab } from '@/components/tabs/products-tab'
import { RepsTab } from '@/components/tabs/reps-tab'
import { DataTab } from '@/components/tabs/data-tab'
import { WelcomeGreeting } from '@/components/welcome-greeting'
import { AuthGuard } from '@/components/auth/AuthGuard'
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
import type { CompanyProfile, SaleRecord } from '@/lib/types'

function Dashboard() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [data, setData] = useState<SaleRecord[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [addSaleOpen, setAddSaleOpen] = useState(false)
  const [hydrating, setHydrating] = useState(true)
  const [showGreeting, setShowGreeting] = useState(false)
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
    async (p: CompanyProfile, regions: string[]) => {
      const base = industryTemplates[p.industry] || industryTemplates['Custom']
      const templateWithRegions = { ...base, regions }
      const seedData = generateSeedData(templateWithRegions)
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

  if (hydrating) {
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
    <div className="min-h-screen bg-background">
      {showGreeting && (
        <WelcomeGreeting
          user={user}
          onDismiss={() => setShowGreeting(false)}
        />
      )}
      <DashboardHeader
        companyName={profile.name}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddSale={() => setAddSaleOpen(true)}
      />
      <KpiBar data={data} currency={currency} />
      <main className="mx-auto max-w-7xl px-4 pb-12 lg:px-6">
        {activeTab === 'overview' && <OverviewTab data={data} currency={currency} />}
        {activeTab === 'regional' && <RegionalTab data={data} currency={currency} template={template} onAddSale={handleAddSale} />}
        {activeTab === 'products' && <ProductsTab data={data} currency={currency} />}
        {activeTab === 'reps' && <RepsTab data={data} currency={currency} />}
        {activeTab === 'data' && (
          <DataTab
            data={data}
            currency={currency}
            onUpdate={handleUpdateSale}
            onDelete={handleDeleteSale}
          />
        )}
      </main>
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
