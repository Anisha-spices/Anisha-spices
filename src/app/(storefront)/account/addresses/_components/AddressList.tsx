'use client'

import React, { useState } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle,
  Phone,
  User,
  Home,
  Check,
  Sparkles,
  Loader2
} from 'lucide-react'
import { AddressForm } from './AddressForm'
import { deleteAddress, setDefaultAddress } from '@/actions/addresses'

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

export function AddressList({ addresses }: { addresses: Address[] }) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return
    setLoadingId(id)
    await deleteAddress(id)
    setLoadingId(null)
  }

  const handleSetDefault = async (id: string) => {
    setLoadingId(id)
    await setDefaultAddress(id)
    setLoadingId(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6B1118] to-[#80121A] text-[#E5AD58] flex items-center justify-center shadow-md shadow-[#6B1118]/20 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                Saved Addresses
              </h1>
              {addresses.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6F2] border border-[#E8DFD5] text-[#6B1118] text-xs font-bold">
                  {addresses.length} {addresses.length === 1 ? 'Saved' : 'Saved'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Manage your delivery addresses for seamless 1-click checkout.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#6B1118] to-[#80121A] text-white text-xs sm:text-sm font-semibold rounded-xl hover:from-[#520C12] hover:to-[#6B1118] shadow-md shadow-[#6B1118]/20 transition-all duration-200 shrink-0 cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4 text-[#E5AD58]" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#FAF6F2]/60 rounded-3xl border-2 border-dashed border-[#E8DFD5]">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8DFD5] text-stone-400 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <MapPin className="w-8 h-8 text-[#6B1118]/60" />
          </div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
            No Addresses Saved Yet
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto mt-1.5 mb-6 leading-relaxed">
            Add your home or office address now so you don&apos;t have to type it every time you order fresh spices!
          </p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6B1118] to-[#80121A] text-white text-xs sm:text-sm font-bold rounded-xl hover:from-[#520C12] hover:to-[#6B1118] shadow-md shadow-[#6B1118]/20 transition-all"
          >
            <Plus className="w-4 h-4 text-[#E5AD58]" />
            <span>Add Your First Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {addresses.map((address) => {
            const isLoading = loadingId === address.id

            return (
              <div
                key={address.id}
                className={`relative flex flex-col justify-between p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  address.is_default
                    ? 'border-[#D49B4B] bg-gradient-to-br from-[#FAF6F2] via-white to-[#FAF6F2]/50 shadow-md ring-1 ring-[#D49B4B]/30'
                    : 'border-stone-200/90 bg-white hover:border-[#6B1118]/40 hover:shadow-lg shadow-xs'
                }`}
              >
                {/* Default Badge */}
                {address.is_default && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#6B1118] text-[#E5AD58] text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    <CheckCircle className="w-3.5 h-3.5 text-[#E5AD58]" />
                    <span>DEFAULT ADDRESS</span>
                  </div>
                )}

                {/* Top Details */}
                <div>
                  {/* Recipient info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-stone-100 border border-stone-200/80 text-[#6B1118] font-bold text-sm flex items-center justify-center shrink-0">
                      {address.full_name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0 pr-20">
                      <h3 className="font-bold text-stone-900 text-base truncate">
                        {address.full_name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>+91 {address.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Address Body Box */}
                  <div className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-200/60 text-xs text-stone-700 space-y-1 leading-relaxed">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#6B1118] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-stone-900">{address.address_line_1}</p>
                        {address.address_line_2 && (
                          <p className="text-stone-500">{address.address_line_2}</p>
                        )}
                        <p className="mt-1 font-semibold text-stone-800">
                          {address.city}, {address.state} —{' '}
                          <span className="bg-stone-200/70 px-1.5 py-0.5 rounded font-mono text-[11px] text-stone-900">
                            {address.postal_code}
                          </span>
                        </p>
                        <p className="text-[11px] text-stone-400 mt-0.5">India</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingAddress(address)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-[#6B1118] hover:text-white transition-colors cursor-pointer"
                      title="Edit Address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete Address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>

                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B1118] hover:text-[#80121A] hover:underline cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Set as Default</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {/* Dedicated "+ Add New Address" Card in the Grid */}
          <div
            onClick={() => setIsAdding(true)}
            className="group rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#6B1118] bg-stone-50/40 hover:bg-[#FAF6F2] transition-all duration-300 p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 group-hover:border-[#6B1118]/40 group-hover:bg-[#6B1118] text-stone-400 group-hover:text-[#E5AD58] flex items-center justify-center shadow-xs transition-all duration-300 mb-3 group-hover:scale-110">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-900 text-sm group-hover:text-[#6B1118] transition-colors">
              Add Another Address
            </h4>
            <p className="text-xs text-stone-500 max-w-[220px] mt-1 leading-relaxed">
              Save another delivery location for your family, work, or relatives.
            </p>
          </div>
        </div>
      )}

      {/* Add / Edit Address Modal */}
      {(isAdding || editingAddress) && (
        <AddressForm
          address={editingAddress}
          onClose={() => {
            setIsAdding(false)
            setEditingAddress(null)
          }}
        />
      )}
    </div>
  )
}
