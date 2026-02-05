import { createClient } from '@supabase/supabase-js'
import { products } from '../lib/mock-data'
import fs from 'fs'
import path from 'path'

// Load environment variables from .env.local manually
const envPath = path.resolve(__dirname, '../.env.local')
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf-8')
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=')
        if (key && value) {
            process.env[key.trim()] = value.trim()
        }
    })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes('your-project') || supabaseServiceKey.includes('your-service-role-key')) {
    console.error('❌ Error: Missing or placeholder environment variables.')
    console.error('Please update .env.local with your actual Supabase URL and Service Role Key.')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
    console.log('🌱 Seeding database...')

    // 1. Seed Products
    console.log(`Adding ${products.length} products...`)

    const productsData = products.map(p => ({
        name: p.name,
        sku: p.sku,
        description: p.description,
        category: p.category,
        cost_price: p.costPrice,
        price: p.sellingPrice,
        stock_quantity: p.stock,
        low_stock_threshold: p.threshold || 10,
        rating: p.rating,
        reviews: p.reviews,
        images: p.images,
        featured: p.featured || false,
        is_active: p.status !== 'out-of-stock' // Simple logic, can be refined
    }))

    const { error: productsError } = await supabase
        .from('products')
        .upsert(productsData, { onConflict: 'sku' })

    if (productsError) {
        console.error('Error seeding products:', productsError)
    } else {
        console.log('✅ Products seeded successfully')
    }

    console.log('✨ Seeding complete!')
}

seed().catch(console.error)
