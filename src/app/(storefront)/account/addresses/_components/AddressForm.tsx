'use client'

import { useState, useTransition } from 'react'
import { X, Save } from 'lucide-react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-border">
          <h2 className="text-xl font-bold text-text">
            {address ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button 
            onClick={onClose}
            className="text-text-muted hover:text-primary transition-colors p-2 -m-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-800 text-sm font-medium rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium leading-6 text-text">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  defaultValue={address?.full_name}
                  required
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-text">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={address?.phone}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Please enter a valid 10-digit phone number"
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address_line_1" className="block text-sm font-medium leading-6 text-text">
                Address Line 1 (House No, Building, Street, Area) <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="address_line_1"
                  name="address_line_1"
                  defaultValue={address?.address_line_1}
                  required
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address_line_2" className="block text-sm font-medium leading-6 text-text">
                Address Line 2 (Locality / Town)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="address_line_2"
                  name="address_line_2"
                  defaultValue={address?.address_line_2 || ''}
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-text">
                City / District <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={address?.city}
                  required
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium leading-6 text-text">
                State <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue={address?.state}
                  required
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium leading-6 text-text">
                PIN Code <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  defaultValue={address?.postal_code}
                  required
                  className="block w-full rounded-md border-0 py-2.5 px-3.5 text-text shadow-sm ring-1 ring-inset ring-border focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>



            <div className="sm:col-span-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_default"
                  defaultChecked={address?.is_default}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-medium text-text">Make this my default shipping address</span>
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-text hover:bg-surface-dark rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-light disabled:opacity-70 transition-colors"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {address ? 'Save Changes' : 'Add Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
