'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  industries,
  businessModels,
  teamSizes,
  growthGoals,
} from '@/lib/industry-templates'
import { WORLD_REGIONS, worldRegionNames, getCurrencyForWorldRegion, getRegionsForWorldRegion } from '@/lib/regions'
import type { CompanyProfile } from '@/lib/types'
import {
  Building2,
  Globe,
  Factory,
  Users,
  Target,
  ArrowRight,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface OnboardingProps {
  onComplete: (profile: CompanyProfile, regions: string[], useSampleData: boolean) => void
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<CompanyProfile>({
    name: '',
    industry: '',
    businessModel: '',
    teamSize: '',
    growthGoal: '',
    worldRegion: '',
    currency: '',
  })
  const [useSampleData, setUseSampleData] = useState(false) // Default to clean slate for premium enterprise

  const totalSteps = 5
  const progressValue = (step / totalSteps) * 100

  const handleNext = useCallback(() => {
    if (step < totalSteps) setStep(step + 1)
    else {
      const regions = getRegionsForWorldRegion(profile.worldRegion)
      onComplete(profile, regions, useSampleData)
    }
  }, [step, profile, totalSteps, onComplete, useSampleData])

  const handleBack = useCallback(() => {
    if (step > 1) setStep(step - 1)
  }, [step])

  const handleSelectRegion = useCallback((region: string) => {
    const currency = getCurrencyForWorldRegion(region)
    setProfile(prev => ({ ...prev, worldRegion: region, currency }))
    handleNext()
  }, [handleNext])

  const canProceed = useCallback(() => {
    switch (step) {
      case 1: return profile.name.length >= 2
      case 2: return !!profile.worldRegion
      case 3: return !!profile.industry
      case 4: return !!profile.businessModel && !!profile.teamSize
      case 5: return !!profile.growthGoal
      default: return false
    }
  }, [step, profile])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-xl">
        {/* Logo Section */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary enterprise-shadow-lg scale-110">
            <BarChart3 className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">SalesIQ</h1>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">Enterprise Analytics</p>
          </div>
        </div>

        {/* Card */}
        <div className="animate-fade-up glass-card rounded-3xl border border-border/50 p-10 shadow-2xl lg:p-12 relative overflow-hidden">
          {/* Progress bar at the top of the card */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressValue}%` }}
            />
          </div>

          {/* Step content */}
          {/* Step 1: Company Name */}
          {step === 1 && (
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Stage 01 — Identification</span>
                <h2 className="font-serif text-3xl font-semibold text-card-foreground leading-tight">
                  Define your enterprise identity
                </h2>
                <p className="text-muted-foreground">
                  Your journey towards data-driven excellence starts with your corporate name.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="company-name" className="text-xs font-bold uppercase tracking-tighter text-muted-foreground">
                  Legal Entity / Commercial Name
                </Label>
                <Input
                  id="company-name"
                  placeholder="e.g. Northrop-Grumman"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canProceed()) handleNext()
                  }}
                  autoFocus
                  className="h-14 border-border/50 bg-background/50 px-5 text-lg transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Step 2: World Region */}
          {step === 2 && (
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Stage 02 — Localization</span>
                <h2 className="font-serif text-3xl font-semibold text-card-foreground">
                  Global operating theater
                </h2>
                <p className="text-muted-foreground">
                  We'll automatically calibrate fiscal metrics and regional divisions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {worldRegionNames.map((regionName) => {
                  const info = WORLD_REGIONS[regionName]
                  const isSelected = profile.worldRegion === regionName
                  return (
                    <button
                      key={regionName}
                      onClick={() => handleSelectRegion(regionName)}
                      className={`group flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all ${isSelected
                        ? 'border-primary bg-primary/5 enterprise-shadow ring-1 ring-primary'
                        : 'border-border/50 bg-background/50 text-card-foreground hover:border-primary/30 hover:bg-background'
                        }`}
                    >
                      <span className="text-2xl grayscale group-hover:grayscale-0 transition-all">{info.flag}</span>
                      <div>
                        <p className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>
                          {regionName}
                        </p>
                        <p className={`text-[10px] font-medium uppercase tracking-tighter ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>
                          {info.currencyCode} · {info.currency}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 3: Industry */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Stage 03 — Market Vertical</span>
                <h2 className="font-serif text-3xl font-semibold text-card-foreground">
                  Sector alignment
                </h2>
                <p className="text-muted-foreground">
                  This fine-tunes the product taxonomy and competitive benchmarks.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setProfile({ ...profile, industry: ind })}
                    className={`rounded-2xl border px-5 py-4 text-left text-sm font-bold tracking-tight transition-all ${profile.industry === ind
                      ? 'border-primary bg-primary/5 text-primary enterprise-shadow ring-1 ring-primary'
                      : 'border-border/50 bg-background/50 text-card-foreground hover:border-primary/30 hover:bg-background'
                      }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Business details */}
          {step === 4 && (
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Stage 04 — Operational Scale</span>
                <h2 className="font-serif text-3xl font-semibold text-card-foreground">
                  Architecture & Capacity
                </h2>
                <p className="text-muted-foreground">
                  Quantifying your operational footprint and logistics model.
                </p>
              </div>
              <div className="flex flex-col gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Strategic Model</Label>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-bold uppercase tracking-tight">
                    {businessModels.map((model) => (
                      <button
                        key={model}
                        onClick={() =>
                          setProfile({ ...profile, businessModel: model })
                        }
                        className={`rounded-xl border px-3 py-3 transition-all ${profile.businessModel === model
                          ? 'border-primary bg-primary/5 text-primary enterprise-shadow'
                          : 'border-border/50 bg-background/50 text-card-foreground hover:border-primary/30'
                          }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Personnel Count</Label>
                  <div className="grid grid-cols-4 gap-2 text-[11px] font-bold uppercase tracking-tight">
                    {teamSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setProfile({ ...profile, teamSize: size })
                        }
                        className={`rounded-xl border px-2 py-3 transition-all ${profile.teamSize === size
                          ? 'border-primary bg-primary/5 text-primary enterprise-shadow'
                          : 'border-border/50 bg-background/50 text-card-foreground hover:border-primary/30'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Growth Goal */}
          {step === 5 && (
            <div className="flex flex-col gap-8">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Stage 05 — Objectives</span>
                <h2 className="font-serif text-3xl font-semibold text-card-foreground">
                  Mission target
                </h2>
                <p className="text-muted-foreground">
                  Finalize your primary strategic objective for this quarter.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {growthGoals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() =>
                      setProfile({ ...profile, growthGoal: goal })
                    }
                    className={`rounded-2xl border px-5 py-5 text-left text-sm font-bold tracking-tight transition-all ${profile.growthGoal === goal
                      ? 'border-primary bg-primary/5 text-primary enterprise-shadow ring-1 ring-primary'
                      : 'border-border/50 bg-background/50 text-card-foreground hover:border-primary/30 hover:bg-background'
                      }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>

              {/* Sample Data Toggle — Refined */}
              <div className="group mt-4 flex items-center justify-between rounded-2xl border border-border/50 bg-muted/20 p-6 transition-all hover:bg-muted/40 hover:border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background enterprise-shadow transition-colors group-hover:bg-primary/5">
                    <CheckCircle2 className={`h-6 w-6 transition-colors ${useSampleData ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Synthetic Intelligence</h4>
                    <p className="max-w-[180px] text-[10px] leading-relaxed text-muted-foreground font-medium uppercase tracking-tighter">
                      {useSampleData ? "Populating with enterprise-grade sample metrics." : "Starting with a clean, unencumbered ledger."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Switch
                    checked={useSampleData}
                    onCheckedChange={setUseSampleData}
                    className="data-[state=checked]:bg-primary"
                  />
                  <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">
                    {useSampleData ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-12 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="h-12 gap-2 text-muted-foreground hover:bg-muted/50 rounded-xl px-6"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Back</span>
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="h-12 gap-3 enterprise-shadow-lg rounded-xl px-8 shadow-primary/20"
            >
              <span className="font-bold uppercase tracking-widest text-[11px]">
                {step === totalSteps ? 'Activate System' : 'Process step'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
            System Identity Verified
          </p>
          <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary/40">
            Step {step} // {totalSteps}
          </p>
        </div>
      </div>
    </div>
  )
}
