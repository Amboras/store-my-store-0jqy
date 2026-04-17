'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/use-cart'
import { toast } from 'sonner'
import { Loader2, Check, Gift, Percent } from 'lucide-react'
import { trackAddToCart } from '@/lib/analytics'

interface BundleOfferProps {
  singleVariantId: string
  singlePrice: number
  bundleVariantId?: string
  bundlePrice?: number
  bundleLabel?: string
  bundleSaving?: number
  currency?: string
}

export default function ProductBundleOffer({
  singleVariantId,
  singlePrice,
  bundleVariantId,
  bundlePrice,
  bundleLabel = 'Value Bundle',
  bundleSaving = 0,
  currency = 'pkr',
}: BundleOfferProps) {
  const [selected, setSelected] = useState<'single' | 'bundle'>('single')
  const [justAdded, setJustAdded] = useState(false)
  const { addItem, isAddingItem } = useCart()

  const formatPrice = (cents: number) => {
    const amount = cents / 100
    if (currency === 'pkr') return `Rs. ${amount.toLocaleString('en-PK')}`
    return `$${(amount).toFixed(2)}`
  }

  const handleAdd = () => {
    const variantId = selected === 'bundle' && bundleVariantId ? bundleVariantId : singleVariantId
    const price = selected === 'bundle' && bundlePrice ? bundlePrice : singlePrice

    addItem(
      { variantId, quantity: 1 },
      {
        onSuccess: () => {
          setJustAdded(true)
          trackAddToCart('', variantId, 1, price)
          toast.success(selected === 'bundle' ? 'Bundle added to bag!' : 'Added to bag')
          setTimeout(() => setJustAdded(false), 2000)
        },
        onError: (err: Error) => toast.error(err.message || 'Failed to add to bag'),
      }
    )
  }

  return (
    <div className="space-y-3 border border-border rounded-sm p-4 bg-[hsl(335,20%,98%)]">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">Choose Your Offer</p>

      {/* Single option */}
      <button
        onClick={() => setSelected('single')}
        className={`w-full flex items-center gap-3 p-3 border transition-all text-left ${
          selected === 'single' ? 'border-foreground bg-background' : 'border-border hover:border-foreground/40 bg-background'
        }`}
      >
        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
          selected === 'single' ? 'border-foreground' : 'border-border'
        }`}>
          {selected === 'single' && <div className="w-2 h-2 rounded-full bg-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">1 x This Item</p>
          <p className="text-xs text-muted-foreground">Standard price</p>
        </div>
        <p className="text-sm font-semibold flex-shrink-0">{formatPrice(singlePrice)}</p>
      </button>

      {/* Bundle option */}
      {bundleVariantId && bundlePrice && (
        <button
          onClick={() => setSelected('bundle')}
          className={`w-full flex items-center gap-3 p-3 border transition-all text-left relative overflow-hidden ${
            selected === 'bundle' ? 'border-accent bg-accent/5' : 'border-accent/50 hover:border-accent bg-background'
          }`}
        >
          {/* Savings badge */}
          <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
            Save {formatPrice(bundleSaving)}
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            selected === 'bundle' ? 'border-accent' : 'border-accent/50'
          }`}>
            {selected === 'bundle' && <div className="w-2 h-2 rounded-full bg-accent" />}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <div className="flex items-center gap-1.5">
              <Gift className="h-3 w-3 text-accent flex-shrink-0" />
              <p className="text-sm font-medium">{bundleLabel}</p>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">Best value — gift-ready packaging included</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-accent">{formatPrice(bundlePrice)}</p>
          </div>
        </button>
      )}

      {/* Add to Cart */}
      <button
        onClick={handleAdd}
        disabled={isAddingItem}
        className={`w-full flex items-center justify-center gap-2 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all ${
          justAdded
            ? 'bg-green-700 text-white'
            : selected === 'bundle'
            ? 'bg-accent text-white hover:opacity-90'
            : 'bg-foreground text-background hover:opacity-90'
        }`}
      >
        {isAddingItem ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : justAdded ? (
          <>
            <Check className="h-4 w-4" />
            Added to Bag
          </>
        ) : selected === 'bundle' ? (
          <>
            <Percent className="h-4 w-4" />
            Add Bundle to Bag
          </>
        ) : (
          'Add to Bag'
        )}
      </button>
    </div>
  )
}
