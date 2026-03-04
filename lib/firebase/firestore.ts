import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
} from 'firebase/firestore'
import { db } from './config'
import type { CompanyProfile, SaleRecord } from '@/lib/types'

// ─── User Profile ──────────────────────────────────────────────────────────

export async function saveProfile(uid: string, profile: CompanyProfile): Promise<void> {
    await setDoc(doc(db, 'users', uid), {
        ...profile,
        updatedAt: serverTimestamp(),
    })
}

export async function getProfile(uid: string): Promise<CompanyProfile | null> {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    const data = snap.data()
    return {
        name: data.name,
        industry: data.industry,
        businessModel: data.businessModel,
        teamSize: data.teamSize,
        growthGoal: data.growthGoal,
        worldRegion: data.worldRegion ?? 'India',
        currency: data.currency ?? '₹',
    }
}

// ─── Sales Records ─────────────────────────────────────────────────────────

const salesCol = (uid: string) => collection(db, 'users', uid, 'sales')

export async function getSales(uid: string): Promise<SaleRecord[]> {
    const snap = await getDocs(salesCol(uid))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SaleRecord))
}

export async function saveSales(uid: string, sales: SaleRecord[]): Promise<void> {
    // Bulk-write all seed records (used on first onboarding)
    const writes = sales.map((s) =>
        setDoc(doc(db, 'users', uid, 'sales', s.id), {
            month: s.month,
            region: s.region,
            product: s.product,
            rep: s.rep,
            revenue: s.revenue,
            units: s.units,
            cost: s.cost,
        })
    )
    await Promise.all(writes)
}

export async function addSaleRecord(
    uid: string,
    record: Omit<SaleRecord, 'id'>
): Promise<string> {
    const ref = await addDoc(salesCol(uid), record)
    return ref.id
}

export async function updateSaleRecord(
    uid: string,
    id: string,
    updates: Partial<SaleRecord>
): Promise<void> {
    // Build a plain object to satisfy Firestore's WithFieldValue constraint
    const plainUpdates: Record<string, string | number | boolean | null> = {}
    if (updates.month !== undefined) plainUpdates.month = updates.month
    if (updates.region !== undefined) plainUpdates.region = updates.region
    if (updates.product !== undefined) plainUpdates.product = updates.product
    if (updates.rep !== undefined) plainUpdates.rep = updates.rep
    if (updates.revenue !== undefined) plainUpdates.revenue = updates.revenue
    if (updates.units !== undefined) plainUpdates.units = updates.units
    if (updates.cost !== undefined) plainUpdates.cost = updates.cost
    await updateDoc(doc(db, 'users', uid, 'sales', id), plainUpdates)
}

export async function deleteSaleRecord(uid: string, id: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid, 'sales', id))
}
