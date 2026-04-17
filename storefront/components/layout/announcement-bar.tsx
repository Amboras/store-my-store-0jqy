'use client'

import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative bg-foreground text-primary-foreground">
      <div className="container-custom flex items-center justify-center gap-2 py-2.5 text-xs tracking-[0.15em] uppercase">
        <Sparkles className="h-3 w-3 flex-shrink-0" />
        <p>
          Free shipping on orders over Rs. 3,000 &nbsp;·&nbsp;{' '}
          <Link href="/products" className="underline underline-offset-2 hover:opacity-80 transition-opacity">
            Shop New Arrivals
          </Link>
        </p>
        <Sparkles className="h-3 w-3 flex-shrink-0" />
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
