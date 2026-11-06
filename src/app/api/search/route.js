import { NextResponse } from 'next/server'
import { searchAll } from '@/lib/search'

export const dynamic = 'force-dynamic'

// GET /api/search?q=wardrobe  -> products, interiors, colours, categories and pages that match
export async function GET(request) {
  const q = new URL(request.url).searchParams.get('q') ?? ''
  return NextResponse.json(await searchAll(q, { limit: 12 }))
}
