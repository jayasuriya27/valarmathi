import { NextResponse } from 'next/server'
import { getProducts, getProductsByCategory } from '@/lib/queries'

export const dynamic = 'force-dynamic'

// GET /api/products            -> all products
// GET /api/products?category=x -> products of one category
// GET /api/products?q=wardrobe -> search
export async function GET(request) {
  const params = new URL(request.url).searchParams
  const category = params.get('category')
  const rows = category ? await getProductsByCategory(category) : await getProducts(params.get('q') ?? '')
  return NextResponse.json(rows)
}
