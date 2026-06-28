'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react'

type Msg = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'What projects has Utkarsh built?',
  'What backend tech does he know?',
  'Is he open to internships?',
  'Tell me about his experience.',
]

const GREETING: Msg = {
  role: 'assistant',
  content:
    "Hi! I'm Utkarsh's AI assistant 👋 Ask me about his projects, skills, experience, or how to get in touch.",
}

export default function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // Don't show the widget inside the admin panel.
  if (pathname?.startsWith('/admin')) return null

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next = [...messages, { role: 'user' as const, content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      const reply =
        res.ok && data.reply
          ? data.reply
          : data.error || "Sorry, something went wrong. Please try again."
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Network error — please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat"
        className="fixed bottom-5 left-5 z-[60] flex items-center gap-2 rounded-full bg-brand-500 px-4 py-3 font-medium text-[var(--text-onbrand)] shadow-[0_10px_40px_-10px_var(--glow-brand)] transition-transform hover:scale-105 active:scale-95"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && <span className="hidden text-sm font-medium sm:inline">Ask my AI</span>}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 left-5 z-[60] flex h-[28rem] w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-border bg-surface-1 shadow-2xl sm:w-96">
          {/* Header */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 text-[var(--text-onbrand)]">
            <Sparkles className="w-4 h-4" />
            <div className="leading-tight">
              <p className="text-sm font-semibold">Ask Utkarsh&apos;s AI</p>
              <p className="text-[11px] opacity-90">Powered by Groq · answers about Utkarsh</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-bg-elevated px-3 py-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-brand-500 text-[var(--text-onbrand)]'
                      : 'rounded-bl-sm border border-border bg-surface-2 text-content'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-border bg-surface-2 px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand-500/50 hover:text-brand-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex items-center gap-2 border-t border-border bg-surface-1 p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Utkarsh…"
              className="flex-1 rounded-xl bg-surface-2 px-3 py-2 text-sm text-content outline-none placeholder:text-subtle"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-brand-500 p-2 text-[var(--text-onbrand)] transition-colors hover:bg-brand-400 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
