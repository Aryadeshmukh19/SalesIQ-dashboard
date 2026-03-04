import { generateText, Output } from 'ai'
import { z } from 'zod'

const marketingPlanSchema = z.object({
  executiveSummary: z.string().describe('2-3 paragraph executive summary of findings and recommendations'),
  opportunities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      impact: z.enum(['High', 'Medium', 'Low']),
      effort: z.enum(['High', 'Medium', 'Low']),
    })
  ).describe('Exactly 3 strategic opportunities'),
  channels: z.array(
    z.object({
      name: z.string(),
      tactic: z.string(),
      kpi: z.string(),
      budgetPercent: z.number(),
    })
  ).describe('Exactly 4 marketing channels with budget percentages summing to 100'),
  productRecommendations: z.object({
    doubleDown: z.array(z.string()),
    improve: z.array(z.string()),
    discontinue: z.array(z.string()),
    reposition: z.array(z.string()),
  }),
  roadmap: z.object({
    q1: z.string(),
    q2: z.string(),
    q3: z.string(),
    q4: z.string(),
  }),
  kpis: z.array(
    z.object({
      name: z.string(),
      current: z.string(),
      target: z.string(),
    })
  ).describe('Exactly 4 KPIs'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { companyProfile, salesSummary } = body

    const { output } = await generateText({
      model: 'anthropic/claude-sonnet-4.6',
      output: Output.object({
        schema: marketingPlanSchema,
      }),
      messages: [
        {
          role: 'user',
          content: `You are a senior marketing strategist. Analyze the following company profile and sales data, then generate a comprehensive marketing plan.

COMPANY PROFILE:
- Company: ${companyProfile.name}
- Industry: ${companyProfile.industry}
- Business Model: ${companyProfile.businessModel}
- Team Size: ${companyProfile.teamSize}
- Growth Goal: ${companyProfile.growthGoal}

SALES DATA SUMMARY:
${salesSummary}

Generate a marketing plan with:
- An executive summary (2-3 paragraphs)
- Exactly 3 strategic opportunities
- Exactly 4 marketing channels (budget percentages must sum to 100)
- Product recommendations (which to double down on, improve, discontinue, or reposition)
- A quarterly roadmap
- Exactly 4 KPIs

Make recommendations specific to the company's industry, business model, and growth goal.`,
        },
      ],
    })

    return Response.json(output)
  } catch (error) {
    console.error('Marketing API error:', error)
    return Response.json(
      { error: 'Failed to generate marketing plan' },
      { status: 500 }
    )
  }
}
