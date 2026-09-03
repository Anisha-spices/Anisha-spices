'use client'

import React, { useState, useTransition } from 'react'
import { X, Save, MapPin, Check, ChevronDown, Loader2 } from 'lucide-react'
import { addAddress, updateAddress } from '@/actions/addresses'

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

export function AddressForm({
  address,
  onClose,
}: {
  address?: Address | null
  onClose: () => void
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Controlled form values for auto-fill
  const [city, setCity] = useState(address?.city || '')
  const [selectedState, setSelectedState] = useState(address?.state || 'Uttar Pradesh')
  const [postalCode, setPostalCode] = useState(address?.postal_code || '')
  const [availableLocalities, setAvailableLocalities] = useState<string[]>(
    address?.city ? [address.city] : []
  )
  const [isVerifyingPincode, setIsVerifyingPincode] = useState(false)
  const [pincodeStatus, setPincodeStatus] = useState<{
    status: 'idle' | 'valid' | 'invalid'
    location?: string
    message?: string
  }>({ status: address?.postal_code ? 'valid' : 'idle' })

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

      setCity(localities[0] || detectedCity)
      setSelectedState(matchedState)
    } catch {
      setPincodeStatus({ status: 'idle' })
      setAvailableLocalities([])
    } finally {
      setIsVerifyingPincode(false)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)
    const fullName = (formData.get('full_name')?.toString() || '').trim()
    const phone = (formData.get('phone')?.toString() || '').trim().replace(/\D/g, '')
    const addressLine1 = (formData.get('address_line_1')?.toString() || '').trim()

    // 1. Full name validation: At least 3 letters, alphabetic & spaces only
    if (!/^[a-zA-Z\s.']{3,60}$/.test(fullName)) {
      setError('Please enter a valid full name (at least 3 alphabetic characters, no numbers or special symbols).')
      return
    }

    // 2. Indian mobile phone: Exactly 10 digits starting with 6, 7, 8, or 9
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.')
      return
    }

    // 3. Street Address: Minimum 6 characters
    if (addressLine1.length < 6) {
      setError('Please enter a complete street address (House/Flat No., Building & Street - minimum 6 characters).')
      return
    }

    // 4. PIN code
    if (pincodeStatus.status === 'invalid') {
      setError('Please enter a valid Indian Postal PIN code before saving.')
      return
    }

    startTransition(async () => {
      const result = address
        ? await updateAddress(address.id, formData)
        : await addAddress(formData)

      if (result.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-3xl border border-stone-200/90 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl z-10">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F2] border border-[#E8DFD5] text-[#6B1118] flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                {address ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h2>
              <p className="text-xs text-stone-500">
                {address ? 'Update your shipping location' : 'Enter your complete address for accurate delivery'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label htmlFor="full_name" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                defaultValue={address?.full_name}
                autoComplete="name"
                required
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
              />
            </div>

            {/* Mobile Number */}
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                10-Digit Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-stone-400">
                  +91
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={address?.phone}
                  autoComplete="tel"
                  required
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all tracking-wider font-mono"
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div className="sm:col-span-2">
              <label htmlFor="address_line_1" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                House / Flat No., Building & Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address_line_1"
                name="address_line_1"
                defaultValue={address?.address_line_1}
                autoComplete="address-line1"
                required
                placeholder="e.g. Flat 104, Sunrise Heights, Mall Road"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
              />
            </div>

            {/* Address Line 2 / Landmark */}
            <div className="sm:col-span-2">
              <label htmlFor="address_line_2" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Area / Landmark <span className="text-stone-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                id="address_line_2"
                name="address_line_2"
                defaultValue={address?.address_line_2 || ''}
                placeholder="e.g. Near City Bank or Opp. Post Office"
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
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={postalCode}
                  onChange={(e) => {
                    const cleanPin = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setPostalCode(cleanPin)
                    if (cleanPin.length === 6) {
                      checkAndAutoFillPincode(cleanPin)
                    } else {
                      setPincodeStatus({ status: 'idle' })
                      setAvailableLocalities([])
                    }
                  }}
                  required
                  maxLength={6}
                  placeholder="221001"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 transition-all tracking-widest font-mono ${
                    pincodeStatus.status === 'valid'
                      ? 'border-emerald-400 focus:ring-emerald-500/20 focus:border-emerald-500'
                      : pincodeStatus.status === 'invalid'
                      ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-stone-200 focus:ring-[#6B1118]/20 focus:border-[#6B1118]'
                  }`}
                />
              </div>

              {pincodeStatus.status === 'valid' && pincodeStatus.location && (
                <p className="mt-1.5 text-xs font-medium text-emerald-700 flex items-center gap-1 animate-in fade-in duration-200">
                  <span>✅</span>
                  <span>Verified Postal Area: <strong>{pincodeStatus.location}</strong></span>
                </p>
              )}

              {pincodeStatus.status === 'invalid' && (
                <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1 animate-in fade-in duration-200">
                  <span>⚠️</span>
                  <span>{pincodeStatus.message || 'Invalid Indian Postal PIN code. Please enter a valid PIN code.'}</span>
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
                    {availableLocalities.length} Verified Areas
                  </span>
                )}
              </div>

              {availableLocalities.length > 0 ? (
                <div className="relative">
                  <select
                    id="city"
                    name="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
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
                  type="text"
                  id="city"
                  name="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  placeholder={
                    isVerifyingPincode
                      ? 'Fetching official areas...'
                      : postalCode.length === 6
                      ? 'Enter valid PIN above to select area'
                      : 'Enter 6-digit PIN code above first'
                  }
                  disabled={postalCode.length < 6}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                />
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
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  required
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all pr-10 cursor-pointer"
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Is Default Checkbox */}
            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="is_default"
                  defaultChecked={address?.is_default}
                  className="h-4 w-4 rounded text-[#6B1118] focus:ring-[#6B1118] border-stone-300 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-medium text-stone-800">
                  Set as my default shipping address for faster checkout
                </span>
              </label>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-6 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#6B1118] to-[#80121A] text-white text-xs sm:text-sm font-bold rounded-xl hover:from-[#520C12] hover:to-[#6B1118] shadow-md shadow-[#6B1118]/20 transition-all cursor-pointer disabled:opacity-70"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-[#E5AD58]" />
              )}
              <span>{address ? 'Save Changes' : 'Save Address'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
