'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowRight, Truck, Shield, RotateCcw, Star, Sparkles, Leaf, FlaskConical } from 'lucide-react'
import CollectionSection from '@/components/marketing/collection-section'
import { useCollections } from '@/hooks/use-collections'
import { trackMetaEvent } from '@/lib/meta-pixel'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'

const HERO_IMAGE = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80'
const LIFESTYLE_IMAGE = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80'
const EDITORIAL_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80'
const EDITORIAL_IMAGE_2 = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80'

const features = [
  {
    icon: FlaskConical,
    title: 'Dermatologist Tested',
    desc: 'Formulas verified safe for all skin types',
  },
  {
    icon: Leaf,
    title: 'Clean Ingredients',
    desc: 'Free from parabens, sulfates & harmful dyes',
  },
  {
    icon: Sparkles,
    title: 'Long-Wearing',
    desc: 'Up to 16-hour wear with transfer-proof finish',
  },
]

const categories = [
  { label: 'Lips', href: '/products?q=lip', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80' },
  { label: 'Eyes', href: '/products?q=eye', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80' },
  { label: 'Face', href: '/products?q=face', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80' },
]

export default function HomePage() {
  const { data: collections, isLoading } = useCollections()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail.trim()) return
    trackMetaEvent('Lead', { content_name: 'newsletter_signup', status: 'submitted' })
    setSubmitted(true)
    setNewsletterEmail('')
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-[hsl(335,20%,97%)] overflow-hidden">
        <div className="container-custom grid lg:grid-cols-2 gap-0 items-stretch min-h-[85vh]">
          {/* Text */}
          <div className="flex flex-col justify-center py-16 lg:py-24 space-y-7 animate-fade-in-up pr-0 lg:pr-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent">
              Prestige Collection — 2025
            </p>
            <h1 className="font-heading text-[clamp(3rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.01em] text-balance">
              Beauty Born<br />
              <em className="not-italic text-accent">From Confidence</em>
            </h1>
            <p className="text-base text-muted-foreground max-w-md leading-relaxed">
              Luxurious makeup formulas engineered to perform — designed to celebrate every complexion, every mood, every you.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/products"
                className="btn-brand-primary inline-flex items-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] transition-opacity"
                prefetch={true}
              >
                Shop The Collection
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 border border-foreground/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] hover:border-foreground transition-colors"
                prefetch={true}
              >
                Our Story
              </Link>
            </div>
            {/* Social proof */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Trusted by <span className="text-foreground font-medium">12,000+</span> customers
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[460px] lg:min-h-0 bg-[hsl(340,20%,92%)] animate-fade-in">
            <Image
              src={HERO_IMAGE}
              alt="Lumière Beauty — Prestige Makeup Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-background/90 backdrop-blur-sm px-5 py-3 shadow-lg border border-border/40">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">New Arrival</p>
              <p className="text-sm font-heading font-semibold mt-0.5">Velvet Matte Collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="divider-rose my-0" />

      {/* ── Feature Pillars ── */}
      <section className="py-12 border-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[hsl(340,50%,96%)] flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-wide">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section className="py-section bg-background">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Curated For You</p>
            <h2 className="font-heading text-h2 font-medium">Shop By Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative aspect-[3/4] overflow-hidden bg-muted block"
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="font-heading text-2xl font-medium text-white tracking-wide">{cat.label}</p>
                  <p className="text-xs text-white/70 uppercase tracking-widest mt-1 flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                    Shop Now <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections ── */}
      {isLoading ? (
        <section className="py-section">
          <div className="container-custom">
            <div className="animate-pulse space-y-4 text-center">
              <div className="h-3 w-20 bg-muted rounded mx-auto" />
              <div className="h-8 w-64 bg-muted rounded mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted rounded animate-pulse" />
              ))}
            </div>
          </div>
        </section>
      ) : collections && collections.length > 0 ? (
        <>
          {collections.map((collection: { id: string; handle: string; title: string; metadata?: Record<string, unknown> }, index: number) => (
            <CollectionSection
              key={collection.id}
              collection={collection}
              alternate={index % 2 === 1}
            />
          ))}
        </>
      ) : null}

      {/* ── Editorial / Brand Story ── */}
      <section className="py-section bg-[hsl(335,20%,97%)]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] bg-muted overflow-hidden relative col-span-1 mt-8">
                <Image
                  src={LIFESTYLE_IMAGE}
                  alt="Lumière Beauty — Lifestyle"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="aspect-[3/4] bg-muted overflow-hidden relative col-span-1">
                <Image
                  src={EDITORIAL_IMAGE}
                  alt="Lumière Beauty — Editorial"
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-6 lg:max-w-md">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Our Philosophy</p>
              <h2 className="font-heading text-h2 font-medium leading-snug">
                Makeup That Moves With You
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                At Lumière, we believe beauty is not a mask — it is an extension of self. Every formula is developed with premium pigments, nourishing actives, and the precision that Pakistani beauty lovers deserve.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Whether you reach for a bold pout or a barely-there glow, our collection is built to inspire and endure — from Karachi mornings to Lahore nights.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] link-underline pb-0.5"
                prefetch={true}
              >
                Learn More
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="py-section-sm border-y bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center text-center md:text-left md:justify-start">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0">
                <Truck className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over Rs. 3,000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0">
                <RotateCcw className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day hassle-free policy</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center md:justify-end text-center md:text-right">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-semibold">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encryption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bestsellers promo strip ── */}
      <section className="py-section bg-foreground text-primary-foreground">
        <div className="container-custom text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Limited Time</p>
          <h2 className="font-heading text-h2 font-medium">
            Get 20% Off Your First Order
          </h2>
          <p className="text-sm text-primary-foreground/70 max-w-md mx-auto leading-relaxed">
            Join the Lumière family and unlock your welcome discount. Enter code <span className="font-semibold text-accent">LUMIERE20</span> at checkout.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-primary-foreground/30 px-8 py-4 text-xs font-semibold uppercase tracking-[0.15em] hover:bg-primary-foreground hover:text-foreground transition-colors"
            prefetch={true}
          >
            Shop Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-section bg-[hsl(335,20%,97%)]">
        <div className="container-custom max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Beauty Insider</p>
          <h2 className="font-heading text-h2 font-medium">Be First to Know</h2>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            New launches, beauty tips, and exclusive offers — delivered to your inbox.
          </p>
          {submitted ? (
            <div className="mt-8 p-6 border border-accent/30 bg-accent/5">
              <p className="text-sm font-medium text-accent">Thank you for joining Lumière!</p>
              <p className="text-xs text-muted-foreground mt-1">Your beauty journey begins now.</p>
            </div>
          ) : (
            <form className="mt-8 flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 border-b border-foreground/30 bg-transparent px-1 py-3 text-sm placeholder:text-muted-foreground focus:border-accent focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-foreground text-background px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
