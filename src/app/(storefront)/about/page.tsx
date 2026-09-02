'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  Award,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  MapPin,
  FileCheck,
  ChevronDown,
  X,
} from 'lucide-react'
import { SPICE_ASSETS } from '@/constants/assets'

// 1. Regional Sourcing Origins with AI Images
const ORIGIN_REGIONS = [
  {
    id: 'salem',
    state: 'Salem & Erode, Tamil Nadu',
    spice: 'High-Curcumin Turmeric',
    tag: '5.2% Active Curcumin',
    badgeColor: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
    image: '/images/about/region-salem.jpg',
    desc: 'Known as the gold capital of Indian turmeric. The fertile Cauvery river belt yields turmeric rhizomes with exceptionally high natural curcumin content and deep golden healing potency.',
    features: ['Direct farmer buyback', 'Sun-cured on earthen yards', 'Rich medicinal grade'],
  },
  {
    id: 'guntur',
    state: 'Guntur & Byadgi, Southern India',
    spice: 'Stemless Red Chillies',
    tag: 'Deep Crimson & Balanced Heat',
    badgeColor: 'bg-red-500/10 text-red-800 border-red-500/30',
    image: '/images/about/region-guntur.jpg',
    desc: 'A master blend of Byadgi chillies (for rich natural red oil and color) and select Guntur chillies (for zesty punch). 100% stemless to ensure zero bitterness and pure unadulterated spice.',
    features: ['100% stem-removed', 'Zero artificial Sudan dyes', 'Cold-process pulverized'],
  },
  {
    id: 'gujarat',
    state: 'Saurashtra, Gujarat',
    spice: 'Aromatic Cumin (Jeera)',
    tag: 'Essential Oil Rich',
    badgeColor: 'bg-stone-500/10 text-stone-800 border-stone-500/30',
    image: '/images/about/region-gujarat.jpg',
    desc: 'The dry, arid soil of Saurashtra produces dense, uniform cumin seeds packed with natural thymol. Slowly roasted to release earthy, nutty warmth in every pinch.',
    features: ['Machine cleaned (Sortex grade)', 'Slow toasted', 'Rich digestive enzymes'],
  },
  {
    id: 'kerala',
    state: 'Idukki & Wayanad, Kerala',
    spice: 'Royal Garam Masala Herbs',
    tag: '16 Handpicked Spices',
    badgeColor: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30',
    image: '/images/about/region-kerala.jpg',
    desc: 'Nestled in the misty Western Ghats, these spice gardens provide our whole green cardamom, Tellicherry black pepper, cloves, and mace for our royal heritage recipe.',
    features: ['Single-estate harvest', 'High volatile oil retention', 'Imperial heirloom aroma'],
  },
]

// 2. Interactive Farm-to-Kitchen Steps with AI Grinding Visuals
const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Ethical Direct Harvest',
    short: 'Sourcing',
    stat: '100% Single Origin',
    image: '/images/about/about-farmers.jpg',
    desc: 'We bypass industrial aggregators and source directly from generational Indian farmers at fair premium prices.',
    detail: 'Only top 5% grade-A whole crops are selected after strict moisture and density checks at farm gates.',
  },
  {
    step: '02',
    title: 'Natural Solar Curing',
    short: 'Sun-Drying',
    stat: '0% Artificial Heat',
    image: '/images/about/region-guntur.jpg',
    desc: 'Whole spices are air-cleaned, destoned, and naturally sun-cured under hygienic poly-tunnels.',
    detail: 'Preserves the delicate botanical oils and enzymes that industrial high-speed ovens incinerate.',
  },
  {
    step: '03',
    title: 'Cryo-Cold Grinding',
    short: 'Aroma-Lock',
    stat: '< 40°C Temperature',
    image: '/images/about/about-grinding.jpg',
    desc: 'Traditional stone-mill inspired slow grinding under controlled low temperature prevents aroma degradation.',
    detail: 'Locks in 100% of the natural volatile spice oils, delivering that intoxicating burst when you open the seal.',
  },
  {
    step: '04',
    title: 'Nitrogen-Flushed Pack',
    short: 'Packaging',
    stat: '12 Months Freshness',
    image: '/images/about/about-hero.jpg',
    desc: 'Hygienically packed in multi-barrier airtight zipper pouches within 24 hours of grinding.',
    detail: 'Prevents oxidation, humidity clumping, and keeps the spice as fresh as the day it was ground.',
  },
]

// 3. Comparison Matrix
const COMPARISON_POINTS = [
  {
    feature: 'Grinding Method',
    regular: 'High-speed industrial pulverizers (burns natural essential oils)',
    anisha: 'Cold-process slow grinding (locks in volatile oils & true aroma)',
  },
  {
    feature: 'Artificial Color & Dyes',
    regular: 'Often adulterated with synthetic red/yellow dyes (Sudan, Tartrazine)',
    anisha: '100% Natural Hue — zero colors, zero chemicals, pure botanical pigment',
  },
  {
    feature: 'Fillers & Bulking Agents',
    regular: 'Starch, sawdust, spent spices, or salt added for weight',
    anisha: 'Zero fillers, zero additives — 100% pure whole spice powder',
  },
  {
    feature: 'Packaging & Shelf Aroma',
    regular: 'Thin plastic bags prone to moisture loss and oxidation',
    anisha: 'Multi-layer aroma-barrier pouches with zipper lock',
  },
  {
    feature: 'Lab Quality Testing',
    regular: 'Rare batch tests, mass aggregated',
    anisha: 'Every single batch tested for heavy metals & purity standards',
  },
]

// 4. FAQ List
const FAQS = [
  {
    q: 'How does Cold-Process Grinding make a difference to my food?',
    a: 'Normal commercial grinders run at extreme speeds and generate temperatures above 80°C, which evaporates volatile spice oils (responsible for flavor and aroma). Anisha Spices uses controlled low-temperature grinding below 40°C, keeping the medicinal curcumin in haldi and the natural capsaicin in chillies fully intact.',
  },
  {
    q: 'Why does your Red Chilly look naturally deeper rather than fluorescent red?',
    a: 'Mass-market chillies often use synthetic water-soluble dyes to appear unnaturally bright red. We use pure stemless Byadgi & Guntur red chillies whose deep crimson hue comes purely from natural capsaicin and natural oils — just honest, authentic color.',
  },
  {
    q: 'Are your spices tested for heavy metals and pesticide safety?',
    a: 'Yes, absolutely. Every production lot is tested by NABL-accredited laboratories to verify zero adulteration, zero heavy metals (Lead, Cadmium), and zero chemical pesticides before packaging.',
  },
  {
    q: 'How should I store Anisha Spices once opened?',
    a: 'Keep the spices in our resealable aroma-protection pouches or transfer them into clean, dry airtight glass/steel jars away from direct sunlight and stove heat to maintain peak fragrance.',
  },
]

export default function AboutPage() {
  const [activeRegion, setActiveRegion] = useState(ORIGIN_REGIONS[0].id)
  const [activeStep, setActiveStep] = useState(0)
  const [labModalOpen, setLabModalOpen] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const currentRegion = ORIGIN_REGIONS.find((r) => r.id === activeRegion) || ORIGIN_REGIONS[0]

  return (
    <div className="bg-[#FAF6F2] min-h-screen text-[#2A1612] overflow-hidden">
      
      {/* 1. Hero Header with AI-Generated Cinematic Farm Visual */}
      <section className="relative bg-gradient-to-b from-[#5C0D13] via-[#701118] to-[#80121A] text-white py-16 sm:py-24 overflow-hidden">
        {/* Ambient Warm Lighting */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-[#D4A373]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/40 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-[#E5AD58]/40 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#F0D5B5] uppercase backdrop-blur-md shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#E5AD58]" />
                <span>Our Heritage &amp; Purity Promise</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]">
                Pure Spice. <br />
                <span className="text-[#E5AD58]">Real Taste.</span><br />
                Trusted Every Time.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-stone-200/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Anisha Spices was born from a timeless conviction: your family deserves pure, unadulterated spices ground cold with natural oils, rich aroma, and zero shortcuts.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#E5AD58] hover:bg-[#d99f47] text-[#2A1612] text-xs sm:text-sm font-bold tracking-wider uppercase shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setLabModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md transition-all active:scale-95"
                >
                  <FileCheck className="w-4 h-4 text-[#E5AD58]" />
                  <span>View Lab Certificate</span>
                </button>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-white/5 backdrop-blur-sm p-3 group">
                <div className="relative w-full h-[320px] sm:h-[380px] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/about/about-hero.jpg"
                    alt="Artisanal Indian Organic Spice Farm Harvest"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A080B]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-[#E5AD58] text-[#2A1612] px-2.5 py-0.5 rounded-full inline-block mb-1">
                      Farm Harvest
                    </span>
                    <h4 className="font-serif text-base font-bold">100% Single Origin Sun-Drying</h4>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Trust Metrics Counter Bar */}
      <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-[#E8DACB] grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-[#EFE5D8]">
            <div className="flex flex-col items-center">
              <span className="font-serif text-3xl sm:text-4xl font-black text-[#80121A]">100%</span>
              <span className="text-xs font-semibold text-[#2A1612] mt-1">Single Origin Harvests</span>
              <span className="text-[11px] text-[#8C7567]">Directly farm-sourced</span>
            </div>
            <div className="flex flex-col items-center pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl font-black text-[#80121A]">0%</span>
              <span className="text-xs font-semibold text-[#2A1612] mt-1">Artificial Dyes or Fillers</span>
              <span className="text-[11px] text-[#8C7567]">Zero Sudan/chemical colors</span>
            </div>
            <div className="flex flex-col items-center pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl font-black text-[#80121A]">&lt; 40°C</span>
              <span className="text-xs font-semibold text-[#2A1612] mt-1">Cold-Process Grinding</span>
              <span className="text-[11px] text-[#8C7567]">Preserves aroma &amp; oils</span>
            </div>
            <div className="flex flex-col items-center pt-4 sm:pt-0">
              <span className="font-serif text-3xl sm:text-4xl font-black text-[#80121A]">50,000+</span>
              <span className="text-xs font-semibold text-[#2A1612] mt-1">Happy Kitchens</span>
              <span className="text-[11px] text-[#8C7567]">Trusted across India</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Brand Story with Authentic AI Farmer Harvest Image */}
      <section className="py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Story Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#80121A]">
                <span>Our Roots &amp; Heritage</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#2A1612] leading-[1.2]">
                The Story Behind Our <span className="text-[#80121A]">Purity</span>
              </h2>

              <div className="flex items-center justify-center lg:justify-start gap-3 py-1">
                <div className="w-12 h-px bg-[#C89B65]" />
                <span className="text-xs text-[#C89B65]">✦</span>
                <div className="w-12 h-px bg-[#C89B65]" />
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#5A433B] leading-relaxed">
                <p>
                  In traditional Indian households, spices are more than just cooking ingredients — they are the heartbeat of family feasts, ancestral healing remedies, and lifelong memories.
                </p>
                <p>
                  Yet, modern mass-produced powders often lose their natural oils and potency through harsh high-heat pulverization, artificial colors, and added starches. At <strong>Anisha Spices</strong>, we set out to restore that lost culinary glory.
                </p>
                <p>
                  We partner directly with generational farmers in Salem, Guntur, and Saurashtra. Every batch of our Turmeric, Kashmiri Red Chilly, Coriander, and Garam Masala is roasted gently and ground cold, locking in the natural antioxidants and unmistakable aroma.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E8DFD5] shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#80121A]/10 flex items-center justify-center text-[#80121A]">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2A1612]">Direct Farmer Sourcing</p>
                    <p className="text-[11px] text-[#6E5951]">Fair-trade ethical harvest</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#E8DFD5] shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-[#80121A]/10 flex items-center justify-center text-[#80121A]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#2A1612]">FSSAI &amp; AGMARK Certified</p>
                    <p className="text-[11px] text-[#6E5951]">NABL Lab-Tested Batches</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Image Card with Real AI Farmer Photo */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
                <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden bg-[#3B070A]">
                  <Image
                    src="/images/about/about-farmers.jpg"
                    alt="Indian farmer holding raw golden turmeric and red chillies"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2A1612]/70 via-transparent to-transparent" />
                </div>

                {/* Floating Seal Stamp Pill */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 rounded-2xl bg-white/95 backdrop-blur-md p-4 border border-[#E8DFD5] shadow-xl flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-[#C89B65] shadow-sm bg-[#FAF6F2]">
                    <Image
                      src={SPICE_ASSETS.qualitySeal}
                      alt="Quality Seal"
                      fill
                      className="object-contain p-1"
                      sizes="56px"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#2A1612]">100% Raw &amp; Untainted</h4>
                    <p className="text-xs text-[#6E5951]">Handpicked directly from generational Indian farms.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Regional Sourcing Explorer with REAL AI REGIONAL HARVEST PHOTOS */}
      <section className="py-20 sm:py-28 bg-[#F4EDE5] border-y border-[#E8DACB] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#80121A]">
              Farm-to-Pouch Traceability
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2A1612] tracking-tight">
              Where Our <span className="text-[#80121A]">Spices</span> Originate
            </h2>
            <p className="text-sm sm:text-base text-[#6E5951]">
              Select any region to explore its single-origin harvest and artisanal spice profile.
            </p>
          </div>

          {/* Region Tabs with 4 distinct visual thumbnails */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {ORIGIN_REGIONS.map((region) => {
              const isActive = activeRegion === region.id
              return (
                <button
                  key={region.id}
                  onClick={() => setActiveRegion(region.id)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-[#80121A] text-white shadow-lg shadow-red-950/20 ring-2 ring-[#80121A]/30'
                      : 'bg-white hover:bg-[#FFE8E8] text-[#4A382D] border border-[#E8DACB]'
                  }`}
                >
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/60 shadow-xs shrink-0">
                    <Image
                      src={region.image}
                      alt={region.spice}
                      fill
                      className="object-cover"
                      sizes="24px"
                    />
                  </div>
                  <span>{region.spice}</span>
                </button>
              )
            })}
          </div>

          {/* Active Region Showcase Card with AI Harvest Photo */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8DACB] shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentRegion.badgeColor}`}>
                    {currentRegion.tag}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#8C7567] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#80121A]" />
                    <span>{currentRegion.state}</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1612]">
                  {currentRegion.spice}
                </h3>

                <p className="text-sm sm:text-base text-[#5A433B] leading-relaxed">
                  {currentRegion.desc}
                </p>

                {/* Key Points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {currentRegion.features.map((feat) => (
                    <div
                      key={feat}
                      className="p-3 rounded-2xl bg-[#FAF6F2] border border-[#EFE5D8] flex items-center gap-2 text-xs font-semibold text-[#2A1612]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#80121A] hover:underline"
                  >
                    <span>Shop {currentRegion.spice} Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* AI Regional Harvest Photo Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-xs sm:max-w-sm h-[260px] sm:h-[320px] rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-[#FAF6F2] group">
                  <Image
                    src={currentRegion.image}
                    alt={currentRegion.spice}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 380px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="inline-block px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#80121A] text-xs font-bold shadow-md">
                      📍 {currentRegion.state}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. Interactive 4-Step Cold-Grinding Process with AI Stone Chakki Photos */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#80121A]">
              The Culinary Science
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2A1612] tracking-tight">
              From Farm To Kitchen
            </h2>
            <p className="text-sm sm:text-base text-[#6E5951]">
              Click each step to see how traditional slow stone-grinding protects fragile volatile spice oils.
            </p>
          </div>

          {/* Interactive Step Navigator */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {PROCESS_STEPS.map((step, idx) => {
              const isActive = activeStep === idx
              return (
                <button
                  key={step.step}
                  onClick={() => setActiveStep(idx)}
                  className={`p-5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#80121A] text-white border-[#80121A] shadow-xl -translate-y-1'
                      : 'bg-white hover:bg-[#FFEAEA] text-[#2A1612] border-[#E8DACB]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`font-serif text-2xl font-bold ${isActive ? 'text-[#E5AD58]' : 'text-[#C89B65]'}`}>
                      {step.step}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#FAF6F2] text-[#80121A]'
                    }`}>
                      {step.stat}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold mt-4 leading-tight">
                    {step.title}
                  </h4>
                </button>
              )
            })}
          </div>

          {/* Active Step Detailed Card with AI Photo */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DACB] shadow-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <span className="text-xs font-bold text-[#80121A] uppercase tracking-widest">
                Step {PROCESS_STEPS[activeStep].step}: {PROCESS_STEPS[activeStep].short}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2A1612]">
                {PROCESS_STEPS[activeStep].title}
              </h3>
              <p className="text-sm text-[#5A433B] leading-relaxed">
                {PROCESS_STEPS[activeStep].desc}
              </p>
              <p className="text-xs text-[#8C7567]">
                ✦ <strong>Culinary Impact:</strong> {PROCESS_STEPS[activeStep].detail}
              </p>

              <div className="pt-2 flex gap-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-full border border-[#E8DACB] text-xs font-bold text-[#2A1612] disabled:opacity-30 hover:bg-[#FAF6F2]"
                >
                  ← Previous
                </button>
                <button
                  disabled={activeStep === PROCESS_STEPS.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(PROCESS_STEPS.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-full bg-[#80121A] text-white text-xs font-bold disabled:opacity-30 hover:bg-[#680C14]"
                >
                  Next Step →
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[260px] h-[200px] rounded-2xl overflow-hidden shadow-md border border-[#E8DACB] bg-[#FAF6F2]">
                <Image
                  src={PROCESS_STEPS[activeStep].image}
                  alt={PROCESS_STEPS[activeStep].title}
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. The Purity Showdown: Market Spices vs. Anisha Spices */}
      <section className="py-20 sm:py-28 bg-[#F8ECE7] border-y border-[#E8DACB] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#80121A]">
              The Honest Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-[#2A1612] tracking-tight">
              Ordinary Spices vs. <span className="text-[#80121A]">Anisha</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6E5951]">
              See why switching to honest, cold-ground spices makes every meal healthier and tastier.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DACB] shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-12 bg-[#FAF6F2] p-4 sm:p-6 border-b border-[#E8DACB] text-xs font-bold uppercase tracking-wider text-[#8C7567]">
              <div className="md:col-span-4 hidden md:block">Quality Parameter</div>
              <div className="md:col-span-4 text-rose-900 font-bold">Standard Market Brands</div>
              <div className="md:col-span-4 text-[#80121A] font-black">Anisha Spices Guaranteed</div>
            </div>

            <div className="divide-y divide-[#F0E5D8]">
              {COMPARISON_POINTS.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 gap-3 items-center hover:bg-[#FFFDFB] transition-colors">
                  <div className="md:col-span-4 font-serif font-bold text-sm text-[#2A1612]">
                    {item.feature}
                  </div>
                  
                  <div className="md:col-span-4 flex items-start gap-2 text-xs text-[#8C5555] bg-rose-50/70 p-3 rounded-xl border border-rose-100">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{item.regular}</span>
                  </div>

                  <div className="md:col-span-4 flex items-start gap-2 text-xs text-[#2A1612] bg-[#FAF3EB] p-3 rounded-xl border border-[#E8DACB] font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item.anisha}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 7. Interactive FAQ Section */}
      <section className="py-20 sm:py-24 bg-[#FAF3EB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#80121A]">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1612]">
              Purity &amp; Quality FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = expandedFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8DACB] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left font-serif font-bold text-sm sm:text-base text-[#2A1612] hover:text-[#80121A] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#80121A] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#5A433B] leading-relaxed border-t border-[#F5EDE1] animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* 8. Bottom CTA Banner with AI-Generated Spice Harvest Backdrop */}
      <section className="relative bg-gradient-to-r from-[#4A0B10] via-[#5C0D13] to-[#731118] text-white py-16 sm:py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Bring Home The Taste of <span className="text-[#E5AD58]">Purity</span>
          </h2>
          <p className="text-sm sm:text-base text-stone-200/90 max-w-xl mx-auto leading-relaxed">
            Taste the honest aroma of generational Indian spices, stone-ground with passion and sealed with integrity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E5AD58] px-8 py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase text-[#2A1612] shadow-xl hover:bg-[#d99f47] transition-all transform hover:-translate-y-0.5"
            >
              <span>Shop All Spices</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-8 py-3.5 text-xs sm:text-sm font-semibold tracking-wider uppercase text-white hover:bg-white/20 transition-all"
            >
              Contact Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Interactive Lab Test Certificate Modal */}
      {labModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setLabModalOpen(false)}
          />

          <div className="relative bg-[#FAF6F2] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8DACB] z-10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE5D8]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#80121A]" />
                <h3 className="font-serif text-lg font-bold text-[#2A1612]">
                  Sample Purity Certificate
                </h3>
              </div>
              <button
                onClick={() => setLabModalOpen(false)}
                className="p-1.5 rounded-full bg-white text-[#8C7567] hover:text-[#80121A] border border-[#E8DACB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5A433B]">
              <div className="p-3 bg-white rounded-xl border border-[#E8DACB] space-y-1.5">
                <div className="flex justify-between font-semibold text-[#2A1612]">
                  <span>Batch: AS-SALEM-2026-09</span>
                  <span className="text-emerald-700 font-bold">STATUS: PASSED ✓</span>
                </div>
                <p className="text-[11px] text-[#8C7567]">Certified by NABL Accredited Testing Facility</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-[#E8DACB] space-y-2.5">
                <div className="flex justify-between py-1 border-b border-[#F5EDE1]">
                  <span>Active Curcumin Content</span>
                  <strong className="text-[#80121A]">5.21% (Grade A+)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EDE1]">
                  <span>Volatile Essential Oils</span>
                  <strong className="text-[#80121A]">4.85 ml / 100g</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EDE1]">
                  <span>Artificial Dyes (Sudan I-IV)</span>
                  <strong className="text-emerald-700">NOT DETECTED (0.00%)</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F5EDE1]">
                  <span>Heavy Metals (Pb, Cd, As)</span>
                  <strong className="text-emerald-700">Below Limits of Detection</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Moisture Level</span>
                  <strong className="text-[#2A1612]">6.4% (Optimal Purity)</strong>
                </div>
              </div>

              <p className="text-[11px] text-[#8C7567] italic text-center">
                * Every batch of Anisha Spices is tested to exceed stringent FSSAI and AGMARK standards.
              </p>
            </div>

            <button
              onClick={() => setLabModalOpen(false)}
              className="w-full py-3 rounded-full bg-[#80121A] text-white text-xs font-bold uppercase tracking-wider shadow-md active:scale-95"
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
