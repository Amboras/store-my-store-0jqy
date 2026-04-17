'use client'

import { useEffect, useState } from 'react'
import { Clock, Users, ShieldCheck, Award, Truck, BadgeCheck } from 'lucide-react'

interface ProductUrgencyProps {
  inventoryQuantity?: number | null
  lowStockThreshold?: number
}

export default function ProductUrgency({
  inventoryQuantity,
  lowStockThreshold = 15,
}: ProductUrgencyProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [viewerCount] = useState(() => Math.floor(Math.random() * 8) + 12) // 12–19

  // Countdown to midnight PKT (UTC+5)
  useEffect(() => {
    const calcTimeLeft = () => {
      const now = new Date()
      const pktOffset = 5 * 60 * 60 * 1000
      const nowPKT = new Date(now.getTime() + pktOffset)
      const midnight = new Date(nowPKT)
      midnight.setUTCHours(24, 0, 0, 0)
      const diff = midnight.getTime() - nowPKT.getTime()
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    calcTimeLeft()
    const timer = setInterval(calcTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  const showLowStock =
    inventoryQuantity != null &&
    inventoryQuantity > 0 &&
    inventoryQuantity <= lowStockThreshold

  return (
    <div className="space-y-3">
      {/* Live viewer count */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span>
          <strong className="text-foreground">{viewerCount} people</strong> are viewing this right now
        </span>
      </div>

      {/* Low stock warning */}
      {showLowStock && (
        <div className="flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-3 py-2">
          <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Only <strong>{inventoryQuantity} left</strong> in stock — order soon
          </span>
        </div>
      )}

      {/* Order deadline */}
      <div className="flex items-center gap-2.5 text-xs border border-border px-3 py-2.5 bg-background">
        <Clock className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
        <div>
          <span className="text-muted-foreground">Order within </span>
          <span className="font-mono font-semibold text-foreground tabular-nums">
            {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
          </span>
          <span className="text-muted-foreground"> for same-day dispatch</span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {[
          { icon: BadgeCheck, label: 'Authentic', sub: '100% genuine' },
          { icon: Truck, label: 'Fast Delivery', sub: '2–4 business days' },
          { icon: Award, label: 'Top Rated', sub: '4.9 / 5 stars' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center p-2 border border-border bg-background gap-1">
            <Icon className="h-4 w-4 text-accent" strokeWidth={1.5} />
            <p className="text-[10px] font-semibold leading-tight">{label}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
