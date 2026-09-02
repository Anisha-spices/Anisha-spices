'use client'

import React, { useState, useTransition } from 'react'
import {
  Truck,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { updateShippingConfig, type ShippingConfig } from '@/actions/shipping'

export function ShippingSettingsClient({
  initialConfig,
}: {
  initialConfig: ShippingConfig
}) {
  const [threshold, setThreshold] = useState(initialConfig.free_shipping_threshold)
  const [shippingCost, setShippingCost] = useState(initialConfig.standard_shipping_cost)
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const res = await updateShippingConfig(threshold, shippingCost)
      if (res.success) {
        setMessage({
          type: 'success',
          text: `Settings saved! Free delivery will apply on orders above ₹${threshold}.`,
        })
      } else {
        setMessage({
          type: 'error',
          text: res.error || 'Failed to save settings.',
        })
      }
    })
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Delivery &amp; Shipping Settings</h1>
        <p className="text-sm text-stone-500 mt-1">
          Set the free delivery order threshold and standard shipping fee.
        </p>
      </div>

      {/* Alert Message */}
      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 border text-sm animate-in fade-in duration-200 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      {/* Settings Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Free Shipping Minimum Threshold */}
          <div>
            <label htmlFor="threshold" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Free Delivery Above (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                id="threshold"
                min="0"
                step="1"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-mono"
                placeholder="500"
              />
            </div>
          </div>

          {/* Standard Delivery Fee */}
          <div>
            <label htmlFor="cost" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
              Standard Shipping Fee (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400 text-sm">
                ₹
              </span>
              <input
                type="number"
                id="cost"
                min="0"
                step="1"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-mono"
                placeholder="90"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isPending ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
