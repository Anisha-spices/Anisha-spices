import { getChatbotConfig } from '@/actions/chatbot'
import { ChatbotSettingsEditor } from './_components/ChatbotSettingsEditor'

export const metadata = {
  title: 'Chatbot Settings | Anisha Masale Admin',
}

export default async function ChatbotSettingsPage() {
  const config = await getChatbotConfig()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">
          Chatbot & Guided Support Settings
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Customize your storefront chatbot greeting, questions, instant answers, and WhatsApp support. No API keys required.
        </p>
      </div>

      <ChatbotSettingsEditor initialConfig={config} />
    </div>
  )
}
