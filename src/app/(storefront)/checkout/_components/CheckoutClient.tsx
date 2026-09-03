'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPin,
  ShieldCheck,
  CheckCircle,
  Truck,
  CreditCard,
  Plus,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  ChevronDown,
  Loader2,
} from 'lucide-react'
import { createOrder, verifyRazorpayPayment, type ShippingAddressInput } from '@/actions/checkout'
import { useCart } from '@/contexts/CartContext'
import Script from 'next/script'

type Address = {
  id: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
  is_default: boolean
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Chandigarh'
]

import type { ShippingConfig } from '@/actions/shipping'

interface CheckoutClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialItems: any[]
  addresses: Address[]
  isAuthenticated: boolean
  userEmail?: string
  shippingConfig?: ShippingConfig
}

export function CheckoutClient({
  initialItems,
  addresses,
  isAuthenticated,
  userEmail = '',
  shippingConfig = { free_shipping_threshold: 500, standard_shipping_cost: 90 },
}: CheckoutClientProps) {
  const router = useRouter()
  const { refreshCart } = useCart()

  // State: Use saved address or new address form
  const hasSavedAddresses = isAuthenticated && addresses.length > 0
  const [useSavedAddress, setUseSavedAddress] = useState<boolean>(hasSavedAddresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.is_default)?.id || (addresses.length > 0 ? addresses[0].id : null)
  )

  // Direct Address Form State
  const [formData, setFormData] = useState<ShippingAddressInput>({
    full_name: '',
    phone: '',
    email: userEmail || '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: 'Uttar Pradesh',
    postal_code: '',
  })

  // Real-time PIN code verification & auto-fill state
  const [isVerifyingPincode, setIsVerifyingPincode] = useState(false)
  const [availableLocalities, setAvailableLocalities] = useState<string[]>([])
  const [pincodeStatus, setPincodeStatus] = useState<{
    status: 'idle' | 'valid' | 'invalid'
    location?: string
    message?: string
  }>({ status: 'idle' })

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'RAZORPAY'>('COD')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate totals
  const subtotal = initialItems.reduce((sum, item) => {
    const price = Number(item.product_variants?.price || 0)
    const qty = Number(item.quantity || 1)
    return sum + price * qty
  }, 0)

  const FREE_SHIPPING_THRESHOLD = shippingConfig.free_shipping_threshold
  const SHIPPING_COST = shippingConfig.standard_shipping_cost
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
  const shipping = isFreeShipping ? 0 : SHIPPING_COST
  const total = subtotal + shipping
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  // Pincode auto-fill & verification function
  const checkAndAutoFillPincode = async (pin: string) => {
    if (!/^\d{6}$/.test(pin)) {
      setPincodeStatus({ status: 'idle' })
      setAvailableLocalities([])
      return
    }

    setIsVerifyingPincode(true)
    try {
      const res = await fetch(`/api/pincode?code=${pin}`)
      const data = await res.json()

      if (!data.valid) {
        setAvailableLocalities([])
        setPincodeStatus({
          status: 'invalid',
          message: data.message || 'Invalid Indian Postal PIN code. Please enter a valid PIN code.',
        })
        return
      }

      // Match state with INDIAN_STATES
      let matchedState = 'Uttar Pradesh'
      if (data.state) {
        const found = INDIAN_STATES.find(
          (st) =>
            st.toLowerCase() === data.state.toLowerCase() ||
            st.toLowerCase().includes(data.state.toLowerCase()) ||
            data.state.toLowerCase().includes(st.toLowerCase())
        )
        if (found) matchedState = found
      }

      const detectedCity = data.city || data.district || ''
      const locationLabel = detectedCity ? `${detectedCity}, ${data.state}` : data.state || 'Verified'
      const localities = Array.isArray(data.postOffices) && data.postOffices.length > 0 
        ? data.postOffices 
        : [detectedCity].filter(Boolean)

      setAvailableLocalities(localities)
      setPincodeStatus({
        status: 'valid',
        location: locationLabel,
      })

      // Auto-populate city with the first verified locality / district
      setFormData((prev) => ({
        ...prev,
        city: localities[0] || detectedCity,
        state: matchedState,
      }))
    } catch {
      // Fallback
      setPincodeStatus({ status: 'idle' })
      setAvailableLocalities([])
    } finally {
      setIsVerifyingPincode(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === 'postal_code') {
      const cleanPin = value.replace(/\D/g, '').slice(0, 6)
      setFormData((prev) => ({ ...prev, postal_code: cleanPin }))
      if (error) setError(null)

      if (cleanPin.length === 6) {
        checkAndAutoFillPincode(cleanPin)
      } else {
        setPincodeStatus({ status: 'idle' })
        setAvailableLocalities([])
      }
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (useSavedAddress && hasSavedAddresses) {
      if (!selectedAddressId) {
        setError('Please select a delivery address from your saved addresses.')
        return
      }
    } else {
      if (!formData.full_name.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (!formData.phone.trim() || formData.phone.trim().length < 10) {
        setError('Please enter a valid 10-digit mobile number.')
        return
      }
      if (!formData.address_line_1.trim()) {
        setError('Please enter your house / flat number and street address.')
        return
      }
      if (!formData.city.trim()) {
        setError('Please enter your city.')
        return
      }
      if (!formData.postal_code.trim() || formData.postal_code.trim().length < 6) {
        setError('Please enter a valid 6-digit PIN code.')
        return
      }
      if (pincodeStatus.status === 'invalid') {
        setError('Please enter a valid Indian Postal PIN code before placing the order.')
        return
      }
    }

    setIsPlacingOrder(true)

    try {
      const addressPayload: string | ShippingAddressInput =
        useSavedAddress && hasSavedAddresses && selectedAddressId
          ? selectedAddressId
          : formData

      const result = await createOrder(addressPayload, paymentMethod)

      if (!result.success) {
        setError(result.error || 'Failed to place order. Please try again.')
        setIsPlacingOrder(false)
        return
      }

      // Handle Razorpay Online Flow
      if (result.isRazorpay && result.razorpayOrderId) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          amount: result.amount,
          currency: 'INR',
          name: 'Anisha Spices',
          description: 'Pure Spices Order',
          order_id: result.razorpayOrderId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          handler: async function (response: any) {
            setIsPlacingOrder(true)
            const verifyResult = await verifyRazorpayPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature,
              result.orderId
            )

            if (verifyResult.success) {
              refreshCart()
              router.push(`/checkout/success?order_number=${result.orderNumber}`)
            } else {
              setError(verifyResult.error || 'Payment verification failed.')
              setIsPlacingOrder(false)
            }
          },
          prefill: {
            name: formData.full_name || addresses.find((a) => a.id === selectedAddressId)?.full_name || '',
            contact: formData.phone || addresses.find((a) => a.id === selectedAddressId)?.phone || '',
            email: formData.email || userEmail || '',
          },
          theme: {
            color: '#6B1118',
          },
        }

        // @ts-ignore
        if (typeof window !== 'undefined' && window.Razorpay) {
          // @ts-ignore
          const rzp = new window.Razorpay(options)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rzp.on('payment.failed', function (response: any) {
            setError(`Payment Failed: ${response.error?.description || 'Payment rejected'}`)
            setIsPlacingOrder(false)
          })
          rzp.open()
        } else {
          setError('Payment SDK failed to load. Please try Cash on Delivery (COD).')
          setIsPlacingOrder(false)
        }
      } else {
        // COD Success Flow
        refreshCart()
        router.push(`/checkout/success?order_number=${result.order_number}`)
      }
    } catch (err: any) {
      console.error('Order submission error:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
      setIsPlacingOrder(false)
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-10 lg:items-start">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Left Column: Form Details (Col 7) */}
      <div className="lg:col-span-7 space-y-8">
        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
          
          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Action Required</p>
                <p className="text-red-600 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Section 1: Delivery Address */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-5 border-b border-stone-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#6B1118] text-[#E5AD58] font-bold text-sm flex items-center justify-center shadow-sm">
                  1
                </div>
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Delivery Address</h2>
                  <p className="text-xs text-stone-500">Where should we deliver your pure spices?</p>
                </div>
              </div>

              {/* Toggle if user has saved addresses */}
              {hasSavedAddresses && (
                <button
                  type="button"
                  onClick={() => setUseSavedAddress((prev) => !prev)}
                  className="text-xs font-semibold text-[#6B1118] hover:text-[#8B1E28] hover:underline"
                >
                  {useSavedAddress ? '+ Enter New Address' : 'Use Saved Address'}
                </button>
              )}
            </div>

            {/* Saved Address Selection Mode */}
            {hasSavedAddresses && useSavedAddress ? (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${
                      selectedAddressId === address.id
                        ? 'border-[#6B1118] bg-[#FAF6F2] ring-1 ring-[#6B1118]'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="saved_address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="h-4 w-4 text-[#6B1118] focus:ring-[#6B1118] mt-1"
                    />
                    <div className="ml-3.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-stone-900">{address.full_name}</span>
                        {address.is_default && (
                          <span className="bg-[#6B1118] text-[#E5AD58] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">{address.phone}</p>
                      <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                        {address.address_line_1}
                        {address.address_line_2 && `, ${address.address_line_2}`}, {address.city}, {address.state} -{' '}
                        <strong>{address.postal_code}</strong>
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              /* New / Guest Address Form Fields */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="full_name" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="full_name"
                    name="full_name"
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
                  />
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    10-Digit Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                      +91
                    </span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all tracking-wider"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address <span className="text-stone-400 font-normal lowercase">(for order tracking)</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="yourname@gmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
                  />
                </div>

                {/* Address Line 1 */}
                <div className="sm:col-span-2">
                  <label htmlFor="address_line_1" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    House / Flat No., Building & Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="address_line_1"
                    name="address_line_1"
                    type="text"
                    required
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Royal Residency, M.G. Road"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
                  />
                </div>

                {/* Address Line 2 / Landmark */}
                <div className="sm:col-span-2">
                  <label htmlFor="address_line_2" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Landmark / Area <span className="text-stone-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    id="address_line_2"
                    name="address_line_2"
                    type="text"
                    value={formData.address_line_2 || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Near City Hospital or Metro Pillar 45"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
                  />
                </div>

                {/* PIN Code (First, to drive Area & State selection) */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="postal_code" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      6-Digit PIN Code <span className="text-red-500">*</span>
                    </label>
                    {isVerifyingPincode && (
                      <span className="text-[11px] text-[#6B1118] flex items-center gap-1 font-medium">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Fetching Official Postal Localities...
                      </span>
                    )}
                  </div>
                  <div className="relative sm:w-1/2">
                    <input
                      id="postal_code"
                      name="postal_code"
                      type="text"
                      required
                      maxLength={6}
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      placeholder="e.g. 221001"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all tracking-widest font-mono ${
                        pincodeStatus.status === 'valid'
                          ? 'border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-500'
                          : pincodeStatus.status === 'invalid'
                          ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-stone-200 focus:ring-[#6B1118]/20 focus:border-[#6B1118]'
                      }`}
                    />
                  </div>

                  {pincodeStatus.status === 'valid' && (
                    <p className="mt-1.5 text-xs font-medium text-emerald-700 flex items-center gap-1 animate-in fade-in duration-200">
                      <span>✅</span>
                      <span>Verified Postal Area: <strong>{pincodeStatus.location}</strong></span>
                    </p>
                  )}

                  {pincodeStatus.status === 'invalid' && (
                    <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1 animate-in fade-in duration-200">
                      <span>⚠️</span>
                      <span>{pincodeStatus.message || 'Invalid Indian Postal PIN code. Please check.'}</span>
                    </p>
                  )}
                </div>

                {/* City / Area Dropdown (Amazon Model) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="city" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
                      City / Area / Town <span className="text-red-500">*</span>
                    </label>
                    {availableLocalities.length > 0 && (
                      <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {availableLocalities.length} Verified Localities
                      </span>
                    )}
                  </div>

                  {availableLocalities.length > 0 ? (
                    <div className="relative">
                      <select
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full appearance-none px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/20 text-stone-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all pr-10 cursor-pointer shadow-xs"
                      >
                        {availableLocalities.map((loc) => (
                          <option key={loc} value={loc}>
                            {loc}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder={
                        isVerifyingPincode
                          ? 'Fetching official areas...'
                          : formData.postal_code.length === 6
                          ? 'Enter valid PIN above to select area'
                          : 'Enter 6-digit PIN code above first'
                      }
                      disabled={formData.postal_code.length < 6}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  )}
                  {availableLocalities.length === 0 && formData.postal_code.length < 6 && (
                    <p className="mt-1 text-[11px] text-stone-400">
                      💡 Enter your PIN code above to pick from verified official post offices.
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full appearance-none px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all pr-10 cursor-pointer"
                    >
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-5 border-b border-stone-100 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#6B1118] text-[#E5AD58] font-bold text-sm flex items-center justify-center shadow-sm">
                2
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900">Payment Option</h2>
                <p className="text-xs text-stone-500">Choose your preferred payment method</p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Cash On Delivery (COD) Option */}
              <label
                className={`relative flex cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-[#6B1118] bg-[#FAF6F2] ring-2 ring-[#6B1118]/20 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="h-4 w-4 text-[#6B1118] focus:ring-[#6B1118] mt-1"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-[#6B1118]" />
                      <span className="font-bold text-stone-900 text-sm">Cash on Delivery (COD)</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Recommended
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    Pay in cash or UPI directly to the delivery person when your order arrives at your door. No prepayment required!
                  </p>
                </div>
              </label>

              {/* Online Payment Option */}
              <label
                className={`relative flex cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all ${
                  paymentMethod === 'RAZORPAY'
                    ? 'border-[#6B1118] bg-[#FAF6F2] ring-2 ring-[#6B1118]/20 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value="RAZORPAY"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  className="h-4 w-4 text-[#6B1118] focus:ring-[#6B1118] mt-1"
                />
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-stone-600" />
                      <span className="font-bold text-stone-900 text-sm">Online Payment (UPI, Cards, NetBanking)</span>
                    </div>
                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      Razorpay
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                    Pay securely using Google Pay, PhonePe, Paytm, Debit/Credit Card, or NetBanking.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>

      {/* Right Column: Order Summary (Col 5) */}
      <div className="lg:col-span-5 mt-8 lg:mt-0">
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-sm sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900">Order Summary</h2>
            <span className="text-xs font-semibold text-stone-500">
              {initialItems.length} {initialItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Free Shipping Alert Bar */}
          {!isFreeShipping ? (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/70 text-xs text-amber-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Add <strong>₹{amountNeededForFreeShipping}</strong> more to qualify for <strong>FREE Delivery</strong>!
              </span>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                🎉 You have unlocked <strong>FREE Doorstep Delivery</strong>!
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 pr-1">
            {initialItems.map((item) => {
              const variant = item.product_variants
              const product = variant?.products
              const imageUrl = product?.featured_image_url || '/images/logo.jpeg'

              return (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-stone-50 border border-stone-200/60 shrink-0">
                    <Image
                      src={imageUrl}
                      alt={product?.name || 'Spice item'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-900 truncate">
                      {product?.name || 'Pure Spice'}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {variant?.variant_name} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-stone-900 shrink-0">
                    ₹{Number(variant?.price || 0) * Number(item.quantity || 1)}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Delivery Charges</span>
              {isFreeShipping ? (
                <span className="font-bold text-emerald-600 uppercase tracking-wider">FREE</span>
              ) : (
                <span className="font-semibold text-stone-900">₹{SHIPPING_COST}</span>
              )}
            </div>
            <div className="pt-3 border-t border-stone-100 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-stone-900">Total Amount</span>
                <p className="text-[10px] text-stone-400">Inclusive of all taxes</p>
              </div>
              <span className="text-2xl font-bold text-[#6B1118]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            type="submit"
            form="checkout-form"
            disabled={isPlacingOrder}
            className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-[#6B1118] to-[#80121A] hover:from-[#520C12] hover:to-[#6B1118] shadow-lg shadow-[#6B1118]/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Placing Your Order...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-[#E5AD58]" />
                <span>
                  {paymentMethod === 'COD'
                    ? `Confirm Order (COD) • ₹${total.toLocaleString('en-IN')}`
                    : `Pay Online • ₹${total.toLocaleString('en-IN')}`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Pure, Stone Ground, Chemical-Free Spices</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#6B1118] shrink-0" />
              <span>Cash on Delivery Available Across India</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>256-Bit SSL Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
