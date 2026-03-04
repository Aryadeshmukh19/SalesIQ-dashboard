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
} from 'lucide-react'

interface OnboardingProps {
  onComplete: (profile: CompanyProfile, regions: string[]) => void
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

  const totalSteps = 5
  const progressValue = (step / totalSteps) * 100

  const canProceed = useCallback(() => {
    switch (step) {
      case 1:
        return profile.name.trim().length > 0
      case 2:
        return profile.worldRegion.length > 0
      case 3:
        return profile.industry.length > 0
      case 4:
        return profile.businessModel.length > 0 && profile.teamSize.length > 0
      case 5:
        return profile.growthGoal.length > 0
      default:
        return false
    }
  }, [step, profile])

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1)
    else {
      const regions = getRegionsForWorldRegion(profile.worldRegion)
      onComplete(profile, regions)
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSelectRegion = (regionName: string) => {
    const currency = getCurrencyForWorldRegion(regionName)
    setProfile({ ...profile, worldRegion: regionName, currency })
  }

  const stepIcons = [Building2, Globe, Factory, Users, Target]
  const stepLabels = ['Company', 'Region', 'Industry', 'Model', 'Goal']

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-2xl text-foreground">SalesIQ</span>
        </div>

        {/* Step indicators */}
        <div className="mb-2 flex items-center justify-between px-1">
          {stepLabels.map((label, i) => {
            const Icon = stepIcons[i]
            const isActive = i + 1 === step
            const isDone = i + 1 < step
            return (
              <div key={label} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : isDone
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                >
                  {label}
                </span>
              </div>
            )
          })}
        </div>

        <Progress value={progressValue} className="mb-8 h-1.5" />

        {/* Card */}
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Step 1: Company Name */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-card-foreground">
                  {"What's your company name?"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"We'll personalize your dashboard experience."}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="company-name" className="text-card-foreground">
                  Company / Brand Name
                </Label>
                <Input
                  id="company-name"
                  placeholder="e.g. Acme Corp"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canProceed()) handleNext()
                  }}
                  autoFocus
                  className="h-12 text-base"
                />
              </div>
            </div>
          )}

          {/* Step 2: World Region */}
          {step === 2 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-card-foreground">
                  Where does your business operate?
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"We'll set the right currency and regions for your data."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {worldRegionNames.map((regionName) => {
                  const info = WORLD_REGIONS[regionName]
                  const isSelected = profile.worldRegion === regionName
                  return (
                    <button
                      key={regionName}
                      onClick={() => handleSelectRegion(regionName)}
                      className={`rounded-xl border px-3 py-3 text-left transition-all ${isSelected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border bg-card text-card-foreground hover:border-primary/30'
                        }`}
                    >
                      <span className="text-xl">{info.flag}</span>
                      <p className={`mt-1 text-sm font-medium ${isSelected ? 'text-primary' : 'text-card-foreground'}`}>
                        {regionName}
                      </p>
                      <p className={`text-xs ${isSelected ? 'text-primary/70' : 'text-muted-foreground'}`}>
                        {info.currency} · {info.currencyCode}
                      </p>
                    </button>
                  )
                })}
              </div>
              {profile.worldRegion && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 px-4 py-2.5 text-sm text-primary border border-primary/20">
                  <span className="font-medium">✓</span>
                  Currency auto-set to <strong>{WORLD_REGIONS[profile.worldRegion].currency}</strong> ({WORLD_REGIONS[profile.worldRegion].currencyCode})
                </div>
              )}
            </div>
          )}

          {/* Step 3: Industry */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-card-foreground">
                  Select your industry
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This loads relevant product lines and sales regions.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setProfile({ ...profile, industry: ind })}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all ${profile.industry === ind
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-card text-card-foreground hover:border-primary/30'
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
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-card-foreground">
                  Business details
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tell us about your business model and team.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">Business Model</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {businessModels.map((model) => (
                      <button
                        key={model}
                        onClick={() =>
                          setProfile({ ...profile, businessModel: model })
                        }
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${profile.businessModel === model
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-card text-card-foreground hover:border-primary/30'
                          }`}
                      >
                        {model}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-card-foreground">Team Size</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {teamSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setProfile({ ...profile, teamSize: size })
                        }
                        className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${profile.teamSize === size
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-card text-card-foreground hover:border-primary/30'
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
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-serif text-2xl text-card-foreground">
                  Primary growth goal
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {"What's your top priority right now?"}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {growthGoals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() =>
                      setProfile({ ...profile, growthGoal: goal })
                    }
                    className={`rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all ${profile.growthGoal === goal
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-card text-card-foreground hover:border-primary/30'
                      }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className="gap-1 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="gap-1"
            >
              {step === totalSteps ? 'Launch Dashboard' : 'Continue'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Step {step} of {totalSteps}
        </p>
      </div>
    </div>
  )
}
