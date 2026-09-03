'use client'

import { useState } from 'react'
import { ChatbotConfig, ChatbotOption, updateChatbotConfig } from '@/actions/chatbot'
import {
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Package,
  Phone,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface ChatbotSettingsEditorProps {
  initialConfig: ChatbotConfig
}

export function ChatbotSettingsEditor({ initialConfig }: ChatbotSettingsEditorProps) {
  const [config, setConfig] = useState<ChatbotConfig>(initialConfig)
  const [saving, setSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleGeneralChange = (field: keyof ChatbotConfig, value: string) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
    if (statusMessage) setStatusMessage(null)
  }

  const handleOptionChange = (
    id: string,
    field: keyof ChatbotOption,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      options: prev.options.map((opt) =>
        opt.id === id ? { ...opt, [field]: value } : opt
      ),
    }))
    if (statusMessage) setStatusMessage(null)
  }

  const handleAddOption = () => {
    const newId = `opt_${Date.now()}`
    const newOption: ChatbotOption = {
      id: newId,
      label: 'New Question',
      type: 'faq_answer',
      answer: 'Enter answer details here...',
      is_active: true,
      display_order: config.options.length + 1,
    }
    setConfig((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }))
  }

  const handleDeleteOption = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      options: prev.options.filter((opt) => opt.id !== id),
    }))
  }

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...config.options]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newOptions.length) return

    const temp = newOptions[index]
    newOptions[index] = newOptions[targetIndex]
    newOptions[targetIndex] = temp

    // update display_order
    newOptions.forEach((opt, idx) => {
      opt.display_order = idx + 1
    })

    setConfig((prev) => ({ ...prev, options: newOptions }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatusMessage(null)

    try {
      const res = await updateChatbotConfig(config)
      if (res.success) {
        setStatusMessage({
          type: 'success',
          text: 'Chatbot settings saved and published to storefront successfully!',
        })
      } else {
        setStatusMessage({
          type: 'error',
          text: res.error || 'Failed to save chatbot settings.',
        })
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred while saving.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in duration-200 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <p className="text-sm font-medium">{statusMessage.text}</p>
        </div>
      )}

      {/* 1. General Bot Identity & Greetings */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="border-b border-stone-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Bot Identity & Greetings</h2>
            <p className="text-xs text-stone-500">
              Customize how the assistant introduces itself on the storefront
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold border border-orange-200">
            Zero API Cost
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Assistant Name
            </label>
            <input
              type="text"
              value={config.bot_name}
              onChange={(e) => handleGeneralChange('bot_name', e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              WhatsApp Support Phone Number
            </label>
            <input
              type="text"
              value={config.whatsapp_number}
              onChange={(e) => handleGeneralChange('whatsapp_number', e.target.value)}
              placeholder="e.g. 919540048786"
              required
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Welcome Title (Top Heading)
            </label>
            <input
              type="text"
              value={config.welcome_title}
              onChange={(e) => handleGeneralChange('welcome_title', e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1.5">
              Welcome Subtitle / Instructions
            </label>
            <textarea
              rows={2}
              value={config.welcome_subtitle}
              onChange={(e) => handleGeneralChange('welcome_subtitle', e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Interactive Questions & Actions Manager */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Chatbot Questions & Actions</h2>
            <p className="text-xs text-stone-500">
              Manage the clickable buttons shown to the customer (Add, Edit, Reorder, or Toggle)
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddOption}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Question
          </button>
        </div>

        <div className="space-y-4">
          {config.options.map((opt, idx) => (
            <div
              key={opt.id}
              className={`p-4 rounded-2xl border transition-all ${
                opt.is_active
                  ? 'border-stone-200 bg-stone-50/50'
                  : 'border-stone-200 bg-stone-100/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-stone-500">
                    {opt.type === 'track_order' && (
                      <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                        <Package className="w-3 h-3" /> Live Order Tracking
                      </span>
                    )}
                    {opt.type === 'faq_answer' && (
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <HelpCircle className="w-3 h-3" /> Instant FAQ
                      </span>
                    )}
                    {opt.type === 'whatsapp' && (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <Phone className="w-3 h-3" /> WhatsApp Link
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveOption(idx, 'up')}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === config.options.length - 1}
                    onClick={() => handleMoveOption(idx, 'down')}
                    className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(opt.id)}
                    className="p-1 text-red-500 hover:text-red-700 cursor-pointer ml-1"
                    title="Delete Option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Label */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Button Label (With Emoji)
                  </label>
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(opt.id, 'label', e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                {/* Action Type */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Action Type
                  </label>
                  <select
                    value={opt.type}
                    onChange={(e) =>
                      handleOptionChange(opt.id, 'type', e.target.value as any)
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                  >
                    <option value="faq_answer">Instant FAQ Answer</option>
                    <option value="track_order">Live Order Tracking</option>
                    <option value="whatsapp">Direct WhatsApp</option>
                  </select>
                </div>

                {/* Answer Textarea (only if faq_answer) */}
                {opt.type === 'faq_answer' && (
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                      Response Text (Displayed when customer clicks this button)
                    </label>
                    <textarea
                      rows={3}
                      value={opt.answer || ''}
                      onChange={(e) => handleOptionChange(opt.id, 'answer', e.target.value)}
                      placeholder="Write answer or bullet points..."
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                )}

                {/* Active Toggle */}
                <div className="sm:col-span-3 flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`active_${opt.id}`}
                    checked={opt.is_active}
                    onChange={(e) =>
                      handleOptionChange(opt.id, 'is_active', e.target.checked)
                    }
                    className="rounded border-stone-300 text-orange-600 focus:ring-orange-500 h-4 w-4 cursor-pointer"
                  />
                  <label
                    htmlFor={`active_${opt.id}`}
                    className="text-xs font-medium text-stone-700 cursor-pointer select-none"
                  >
                    Active on Storefront
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#7B111A] text-white font-bold text-sm shadow-md hover:bg-[#600d14] disabled:opacity-60 transition-all cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving Settings...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save & Publish Chatbot
            </>
          )}
        </button>
      </div>
    </form>
  )
}
