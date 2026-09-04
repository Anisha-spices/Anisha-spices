import { Mail, Phone, MapPin, Clock, MessageSquare, PackageCheck, Truck, ShieldCheck } from 'lucide-react'
import { ContactForm } from '@/components/storefront/ContactForm'

export const metadata = {
  title: 'Contact Us — We Are Here To Help | Anisha Spices',
  description: 'Get in touch with the Anisha Spices customer care team for product queries, wholesale & bulk orders, or shipping assistance.',
}

export default function ContactPage() {
  const contactDetails = [
    {
      title: 'Our Store & Experience Hub',
      desc: 'T891 A/1 Aulia Masjid, Ward No 8 Mehrauli, New Delhi 110030',
      actionText: 'Get Directions',
      actionHref: 'https://maps.google.com/?q=Mehrauli+New+Delhi+110030',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      title: 'Call & WhatsApp Support',
      desc: '+91 9540048786 (Mon – Sat, 9:00 AM – 7:00 PM IST)',
      actionText: 'Chat on WhatsApp',
      actionHref: 'https://wa.me/919540048786',
      icon: <Phone className="w-5 h-5" />,
    },
    {
      title: 'Email Inquiries',
      desc: 'info@anishamasala.com (We respond within 24 business hours)',
      actionText: 'Send an Email',
      actionHref: 'mailto:info@anishamasala.com',
      icon: <Mail className="w-5 h-5" />,
    },
    {
      title: 'Working Hours',
      desc: 'Monday to Saturday: 9:00 AM – 7:00 PM IST (Sunday Closed)',
      actionText: null,
      actionHref: null,
      icon: <Clock className="w-5 h-5" />,
    },
  ]

  const supportCards = [
    {
      title: 'Wholesale & Bulk Orders',
      desc: 'Special B2B pricing and packaging for restaurants, caterers, and retail stores.',
      icon: <PackageCheck className="w-6 h-6" />,
    },
    {
      title: 'All-India Express Delivery',
      desc: 'Reliable doorstep delivery across all pin codes in India with live tracking.',
      icon: <Truck className="w-6 h-6" />,
    },
    {
      title: '100% Purity Guarantee',
      desc: 'Every spice batch is lab tested and sealed fresh for authentic aroma and taste.',
      icon: <ShieldCheck className="w-6 h-6" />,
    },
  ]

  return (
    <div className="bg-[#F8ECE7] min-h-screen text-[#2A1612] overflow-hidden">
      
      {/* 1. Hero Header */}
      <section className="relative bg-[#6B1118] text-white py-14 sm:py-20 lg:py-24 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,155,101,0.25),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.5),transparent_60%)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-[#E5AD58]/30 px-4 py-1 text-xs sm:text-sm font-semibold tracking-wider text-[#E5AD58] uppercase">
            <span>✦</span>
            <span>We&apos;re Here For You</span>
            <span>✦</span>
          </div>

          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.15]">
            Get In <span className="text-[#D4A373]">Touch</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-stone-200/90 max-w-xl mx-auto leading-relaxed font-normal">
            Have a question about our spices, bulk orders, or custom blends? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* 2. Main Content: Info & Form */}
      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left: Contact Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#7B111A]">Contact Channels</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1612]">
                  How Can We Help You?
                </h2>
                <p className="text-xs sm:text-sm text-[#5A433B] leading-relaxed">
                  Reach out to us through any of the channels below or fill out the form, and our team will get in touch promptly.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {contactDetails.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl bg-white p-5 border border-[#E8DFD5] shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="w-11 h-11 rounded-full bg-[#FAF3EB] border border-[#C89B65]/40 flex items-center justify-center text-[#7B111A] shrink-0 mt-0.5 shadow-sm">
                      {item.icon}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#2A1612]">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6E5951] leading-relaxed">
                        {item.desc}
                      </p>
                      {item.actionText && item.actionHref && (
                        <a
                          href={item.actionHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs font-bold text-[#7B111A] hover:text-[#520C12] hover:underline pt-1 transition-colors"
                        >
                          {item.actionText} →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>

      {/* 3. Three Quick Support Pillars */}
      <section className="py-12 sm:py-16 bg-[#FAF3EB] border-t border-[#E8DFD5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportCards.map((c) => (
              <div
                key={c.title}
                className="rounded-2xl bg-white p-6 border border-[#E8DFD5] shadow-sm flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF3EB] border border-[#C89B65]/40 flex items-center justify-center text-[#7B111A] shadow-sm">
                  {c.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#2A1612]">{c.title}</h3>
                <p className="text-xs text-[#6E5951] leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
