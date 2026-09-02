'use client'

import React, { useState, useTransition } from 'react'
import { X, Save, MapPin, Check, ChevronDown } from 'lucide-react'
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

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
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  placeholder="9876543210"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all tracking-wider"
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

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                City / Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                defaultValue={address?.city}
                required
                placeholder="e.g. Varanasi"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all"
              />
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
                  defaultValue={address?.state || 'Uttar Pradesh'}
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

            {/* PIN Code */}
            <div className="sm:col-span-2">
              <label htmlFor="postal_code" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                6-Digit PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="postal_code"
                name="postal_code"
                defaultValue={address?.postal_code}
                required
                maxLength={6}
                pattern="[0-9]{6}"
                placeholder="221001"
                className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B1118]/20 focus:border-[#6B1118] focus:bg-white transition-all tracking-widest font-mono"
              />
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
