import { createClient } from "@/utils/supabase/server"
import { CustomerStorefront } from "../src/components/storefront/CustomerStorefront"
import { Product } from "@/lib/mock-data"

export default async function SyntheticV0PageForDeployment() {
  const supabase = await createClient()

  const { data: dbProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  const products: Product[] = (dbProducts || []).map((p: any) => {
    const stock = p.stock_quantity || 0
    const threshold = p.low_stock_threshold || 10

    let status: "in-stock" | "low-stock" | "out-of-stock" = "in-stock"
    if (stock === 0) status = "out-of-stock"
    else if (stock <= threshold) status = "low-stock"

    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      description: p.description || "",
      category: p.category,
      costPrice: Number(p.cost_price),
      sellingPrice: Number(p.price),
      stock: stock,
      threshold: threshold,
      rating: Number(p.rating || 0),
      reviews: p.reviews || 0,
      images: p.images || [], // Expecting a text[] array from DB
      featured: p.featured || false,
      status: status
    }
  })

  return <CustomerStorefront initialProducts={products.length > 0 ? products : undefined} />
}