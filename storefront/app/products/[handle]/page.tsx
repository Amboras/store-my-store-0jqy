import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 3600
import { medusaServerClient } from '@/lib/medusa-client'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Lock } from 'lucide-react'
import ProductActions from '@/components/product/product-actions'
import ProductAccordion from '@/components/product/product-accordion'
import { ProductViewTracker } from '@/components/product/product-view-tracker'
import ProductBundleOffer from '@/components/product/product-bundle-offer'
import ProductUrgency from '@/components/product/product-urgency'
import { getProductPlaceholder } from '@/lib/utils/placeholder-images'
import { type VariantExtension } from '@/components/product/product-price'

// Bundle config: map a product handle → its bundle product handle
const BUNDLE_MAP: Record<string, string> = {
  'velvet-matte-liquid-lipstick': 'velvet-matte-lip-set-3-shades',
  'precision-kohl-eyeliner': 'eye-artistry-duo-set',
}

async function getProduct(handle: string) {
  try {
    const regionsResponse = await medusaServerClient.store.region.list()
    const regionId = regionsResponse.regions[0]?.id
    if (!regionId) throw new Error('No region found')

    const response = await medusaServerClient.store.product.list({
      handle,
      region_id: regionId,
      fields: '*variants.calculated_price',
    })
    return response.products?.[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function getVariantExtensions(productId: string): Promise<Record<string, VariantExtension>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const storeId = process.env.NEXT_PUBLIC_STORE_ID
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    const headers: Record<string, string> = {}
    if (storeId) headers['X-Store-Environment-ID'] = storeId
    if (publishableKey) headers['x-publishable-api-key'] = publishableKey

    const res = await fetch(
      `${baseUrl}/store/product-extensions/products/${productId}/variants`,
      { headers, next: { revalidate: 30 } },
    )
    if (!res.ok) return {}

    const data = await res.json()
    const map: Record<string, VariantExtension> = {}
    for (const v of data.variants || []) {
      map[v.id] = {
        compare_at_price: v.compare_at_price,
        allow_backorder: v.allow_backorder ?? false,
        inventory_quantity: v.inventory_quantity,
      }
    }
    return map
  } catch {
    return {}
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    return { title: 'Product Not Found' }
  }

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} at Lumière Beauty`,
    openGraph: {
      title: product.title,
      description: product.description || `Shop ${product.title} at Lumière Beauty`,
      ...(product.thumbnail ? { images: [{ url: product.thumbnail }] } : {}),
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const variantExtensions = await getVariantExtensions(product.id)

  // Load bundle product if mapped
  const bundleHandle = BUNDLE_MAP[handle]
  const bundleProduct = bundleHandle ? await getProduct(bundleHandle) : null
  const bundleVariant = bundleProduct?.variants?.[0]
  const bundleVariantExt = bundleVariant?.id ? await getVariantExtensions(bundleProduct!.id) : {}

  const primaryVariant = product.variants?.[0]
  const primaryVariantExt = primaryVariant?.id ? variantExtensions[primaryVariant.id] : null

  const cp = primaryVariant?.calculated_price
  const singlePrice: number =
    cp && typeof cp !== 'number' && typeof cp.calculated_amount === 'number'
      ? cp.calculated_amount
      : 0
  const bundleCp = bundleVariant?.calculated_price
  const bundlePrice: number =
    bundleCp && typeof bundleCp !== 'number' && typeof bundleCp.calculated_amount === 'number'
      ? bundleCp.calculated_amount
      : 0

  const bundleSaving = singlePrice > 0 && bundlePrice > 0 ? Math.max(0, singlePrice * 3 - bundlePrice) : 0

  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail }] : []),
    ...(product.images || []).filter((img: { url: string }) => img.url !== product.thumbnail),
  ]

  const displayImages = allImages.length > 0
    ? allImages
    : [{ url: getProductPlaceholder(product.id) }]

  const inventoryQuantity = primaryVariant?.id
    ? variantExtensions[primaryVariant.id]?.inventory_quantity
    : null

  const showBundle = !!bundleVariant?.id && bundlePrice > 0 && singlePrice > 0

  return (
    <>
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* ── Product Images ── */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-muted">
              <Image
                src={displayImages[0].url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {displayImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {displayImages.slice(1, 5).map((image: { url: string }, idx: number) => (
                  <div key={idx} className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <Image
                      src={image.url}
                      alt={`${product.title} ${idx + 2}`}
                      fill
                      sizes="12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">

            {/* Brand + Title */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-accent font-medium mb-1.5">
                Lumière Beauty
              </p>
              {product.subtitle && (
                <p className="text-sm uppercase tracking-[0.15em] text-muted-foreground mb-1">
                  {product.subtitle}
                </p>
              )}
              <h1 className="font-heading text-h2 font-medium leading-snug">{product.title}</h1>
            </div>

            <ProductViewTracker
              productId={product.id}
              productTitle={product.title}
              variantId={primaryVariant?.id || null}
              currency={cp && typeof cp !== 'number' ? (cp.currency_code || 'pkr') : 'pkr'}
              value={singlePrice}
            />

            {/* Urgency signals */}
            <ProductUrgency
              inventoryQuantity={inventoryQuantity}
              lowStockThreshold={15}
            />

            {/* Variant Selector + Price */}
            <ProductActions product={product} variantExtensions={variantExtensions} />

            {/* Bundle Offer (only when mapped) */}
            {showBundle && (
              <ProductBundleOffer
                singleVariantId={primaryVariant!.id}
                singlePrice={singlePrice}
                bundleVariantId={bundleVariant!.id}
                bundlePrice={bundlePrice}
                bundleLabel={bundleProduct!.title}
                bundleSaving={bundleSaving}
                currency={cp && typeof cp !== 'number' ? (cp.currency_code || 'pkr') : 'pkr'}
              />
            )}

            {/* Secure Checkout Strip */}
            <div className="flex items-center justify-center gap-2 py-2.5 border border-border bg-muted/30 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" strokeWidth={1.5} />
              <span>Secure &amp; encrypted checkout — 100% safe</span>
            </div>

            {/* Accordion */}
            <ProductAccordion
              description={product.description}
              details={product.metadata as Record<string, string> | undefined}
            />
          </div>
        </div>
      </div>
    </>
  )
}
