'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Loader2, Sparkles, MessageCircle, Send } from 'lucide-react'

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
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, isMinimized])

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
          : data.error || 'Sorry, something went wrong. Please try again.'
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

  /* ── Closed state: launch button ── */
  if (!open) {
    return (
      <div className="fixed bottom-6 left-6 z-[60]">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid #3a3a3a',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#e5e5e5',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.transform = 'translateY(-2px)'
            b.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement
            b.style.transform = 'translateY(0)'
            b.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <MessageCircle style={{ width: '16px', height: '16px', color: '#57c7ff' }} />
          <span>Ask my AI</span>
        </button>
      </div>
    )
  }

  /* ── Open state: macOS window ── */
  return (
    <div
      className="fixed z-[60]"
      style={{
        bottom: isMaximized ? '0' : '24px',
        left: isMaximized ? '0' : '24px',
        width: isMaximized ? '100vw' : '384px',
        height: isMaximized ? '100vh' : 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: isMaximized ? '0' : '12px',
          overflow: 'hidden',
          boxShadow:
            '0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          flexDirection: 'column',
          height: isMaximized ? '100%' : 'auto',
        }}
      >
        {/* macOS Title Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(180deg, #323232 0%, #2a2a2a 100%)',
            borderBottom: '1px solid #111',
            padding: '10px 14px',
            userSelect: 'none',
            position: 'relative',
            gap: '0',
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
            {/* Red – Close */}
            <button
              onClick={() => setOpen(false)}
              title="Close"
              style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ff5f57', border: '1px solid rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'transparent', transition: 'color 0.15s', padding: 0, lineHeight: 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6e1004' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'transparent' }}
            >✕</button>

            {/* Yellow – Minimize */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title="Minimize"
              style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#febc2e', border: '1px solid rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'transparent', transition: 'color 0.15s', padding: 0, lineHeight: 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b4c00' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'transparent' }}
            >−</button>

            {/* Green – Maximize */}
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              title="Full Screen"
              style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#28c840', border: '1px solid rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'transparent', transition: 'color 0.15s', padding: 0, lineHeight: 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#003800' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'transparent' }}
            >+</button>
          </div>

          {/* Centred title */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#9a9a9a',
              fontSize: '13px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontWeight: 500,
              letterSpacing: '0.01em',
              pointerEvents: 'none',
            }}
          >
            <Sparkles style={{ width: '13px', height: '13px', color: '#57c7ff' }} />
            <span>Ask Utkarsh&apos;s AI</span>
          </div>

          <div style={{ width: '50px', marginLeft: 'auto' }} />
        </div>

        {/* Sub-header */}
        {!isMinimized && (
          <div
            style={{
              background: '#252525',
              borderBottom: '1px solid #2a2a2a',
              padding: '6px 14px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontSize: '11px',
              color: '#6e6e6e',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
            Powered by Groq · answers about Utkarsh
          </div>
        )}

        {/* Messages */}
        {!isMinimized && (
          <>
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                height: isMaximized ? 'calc(100vh - 160px)' : '320px',
                overflowY: 'auto',
                padding: '12px',
                background: '#1e1e1e',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#444 transparent',
              }}
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '85%',
                      padding: '8px 12px',
                      borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      background: m.role === 'user'
                        ? 'linear-gradient(135deg, #0a84ff 0%, #0070d6 100%)'
                        : '#2a2a2a',
                      color: m.role === 'user' ? '#ffffff' : '#d4d4d4',
                      border: m.role === 'user' ? 'none' : '1px solid #333',
                      boxShadow: m.role === 'user'
                        ? '0 2px 8px rgba(10, 132, 255, 0.3)'
                        : '0 1px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div
                    style={{
                      padding: '8px 14px',
                      borderRadius: '14px 14px 14px 4px',
                      background: '#2a2a2a',
                      border: '1px solid #333',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {/* Typing dots */}
                    {[0, 1, 2].map(n => (
                      <span
                        key={n}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#57c7ff',
                          display: 'inline-block',
                          animation: `bounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                        }}
                      />
                    ))}
                    <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '4px' }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #333',
                        borderRadius: '20px',
                        padding: '5px 10px',
                        color: '#8a8a8a',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        fontSize: '11px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.borderColor = '#0a84ff'
                        b.style.color = '#57c7ff'
                      }}
                      onMouseLeave={e => {
                        const b = e.currentTarget as HTMLButtonElement
                        b.style.borderColor = '#333'
                        b.style.color = '#8a8a8a'
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={e => { e.preventDefault(); send(input) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px 14px',
                background: '#1e1e1e',
                borderTop: '1px solid #2a2a2a',
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about Utkarsh…"
                autoComplete="off"
                spellCheck={false}
                style={{
                  flex: 1,
                  background: '#2a2a2a',
                  border: '1px solid #383838',
                  borderRadius: '20px',
                  padding: '7px 14px',
                  color: '#e5e5e5',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#0a84ff' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#383838' }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: loading || !input.trim() ? '#2a2a2a' : 'linear-gradient(135deg, #0a84ff 0%, #0070d6 100%)',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  opacity: loading || !input.trim() ? 0.4 : 1,
                }}
              >
                {loading
                  ? <Loader2 style={{ width: '14px', height: '14px', color: '#57c7ff', animation: 'spin 1s linear infinite' }} />
                  : <Send style={{ width: '14px', height: '14px', color: '#fff', marginLeft: '1px' }} />
                }
                <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
              </button>
            </form>
          </>
        )}

        {/* Minimized state */}
        {isMinimized && (
          <div
            style={{
              padding: '10px 16px',
              background: '#1e1e1e',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              fontSize: '12px',
              color: '#555',
              textAlign: 'center',
            }}
          >
            Chat minimized · click yellow dot to expand
          </div>
        )}
      </div>
    </div>
  )
}
