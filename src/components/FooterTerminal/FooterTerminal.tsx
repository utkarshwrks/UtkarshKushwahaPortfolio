'use client'
import { useState, useRef, useEffect } from 'react'
import { Terminal } from 'lucide-react'
import { siteCopy } from '@/lib/site-settings'

const HELP = `Available commands:
  cd home     → Navigate to home section
  cd about    → Navigate to about section
  cd projects → Navigate to projects section  
  cd skills   → Navigate to skills section
  cd contact  → Navigate to contact section
  whoami      → Display my identity
  skills      → Show my tech stack
  help        → Show available commands
  github      → Open GitHub profile
  clear       → Clear terminal history
`

export default function FooterTerminal() {
  const [output, setOutput] = useState<string[]>([
    'Welcome to portfolio terminal! 🚀',
    'Type "help" to see available commands.',
  ])
  const [input, setInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  useEffect(() => {
    if (isVisible && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible, isMinimized])

  function run(cmd: string) {
    const c = cmd.trim().toLowerCase()
    if (!c) return

    setOutput(o => [...o, `visitor@portfolio ~ % ${cmd}`])

    switch (c) {
      case 'help':
        setOutput(o => [...o, HELP])
        break
      case 'clear':
        setOutput([])
        break
      case 'whoami':
        setOutput(o => [...o, ...siteCopy.terminalWhoami])
        break
      case 'skills':
        setOutput(o => [...o, ...siteCopy.terminalSkills])
        break
      case 'github':
        window.open('https://github.com/utkarshwrks', '_blank')
        setOutput(o => [...o, '→ Opening GitHub profile...'])
        break
      default:
        if (c.startsWith('cd ')) {
          const dir = c.split(' ')[1]
          const sections: { [key: string]: string } = {
            home: 'home',
            about: '/about',
            projects: 'projects',
            skills: 'skills',
            contact: 'contact',
          }
          const sectionId = sections[dir]
          if (sectionId) {
            const el = document.getElementById(sectionId)
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setOutput(o => [...o, `→ Navigating to ${dir}...`])
            } else {
              setOutput(o => [...o, `bash: cd: ${dir}: section not found`])
            }
          } else {
            setOutput(o => [...o, `bash: cd: ${dir}: No such section`])
          }
        } else {
          setOutput(o => [...o, `bash: ${cmd}: command not found`])
        }
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsVisible(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
            border: '1px solid #3a3a3a',
            borderRadius: '10px',
            padding: '10px 16px',
            color: '#e5e5e5',
            fontFamily: '"SF Mono", "Monaco", "Menlo", monospace',
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
          <span style={{ fontSize: '16px' }}>⌘</span>
          <span>Open Terminal</span>
        </button>
      </div>
    )
  }

  return (
    <div
      className="fixed z-50"
      style={{
        bottom: isMaximized ? '0' : '24px',
        right: isMaximized ? '0' : '24px',
        width: isMaximized ? '100vw' : '520px',
        height: isMaximized ? '100vh' : 'auto',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          background: '#1e1e1e',
          borderRadius: isMaximized ? '0' : '12px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
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
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #323232 0%, #2a2a2a 100%)',
            borderBottom: '1px solid #111',
            padding: '10px 14px',
            userSelect: 'none',
            position: 'relative',
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1 }}>
            <button
              onClick={() => setIsVisible(false)}
              title="Close"
              style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#ff5f57', border: '1px solid rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: 'transparent', transition: 'color 0.15s', padding: 0, lineHeight: 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6e1004' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'transparent' }}
            >✕</button>

            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title="Minimize"
              style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#febc2e', border: '1px solid rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'transparent', transition: 'color 0.15s', padding: 0, lineHeight: 1 }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b4c00' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'transparent' }}
            >−</button>

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
            <Terminal style={{ width: '14px', height: '14px' }} />
            <span>portfolio — bash — 80×24</span>
          </div>

          <div style={{ width: '50px' }} />
        </div>

        {/* Terminal body */}
        {!isMinimized && (
          <>
            <div
              ref={terminalRef}
              onClick={() => inputRef.current?.focus()}
              style={{
                flex: 1,
                height: isMaximized ? 'calc(100vh - 120px)' : '280px',
                overflowY: 'auto',
                padding: '12px 16px 4px',
                fontFamily: '"SF Mono", "Monaco", "Menlo", "Courier New", monospace',
                fontSize: '13px',
                lineHeight: '1.65',
                background: '#1e1e1e',
                cursor: 'text',
                scrollbarWidth: 'thin',
                scrollbarColor: '#444 transparent',
              }}
            >
              <div style={{ color: '#6e6e6e', marginBottom: '6px', fontSize: '12px' }}>
                Last login: {new Date().toDateString()} on ttys001
              </div>

              {output.map((line, i) => {
                const isPromptLine = line.startsWith('visitor@portfolio ~ %')
                const isBashError = line.startsWith('bash:')
                const isSuccess = line.startsWith('→')
                const isWelcome = line.includes('🚀') || line.includes('"help"')

                return (
                  <div
                    key={i}
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      color: isBashError ? '#ff6b6b' : isSuccess ? '#5af78e' : isWelcome ? '#57c7ff' : '#c7c7c7',
                    }}
                  >
                    {isPromptLine ? (
                      <span>
                        <span style={{ color: '#5af78e', fontWeight: 600 }}>visitor</span>
                        <span style={{ color: '#c7c7c7' }}>@</span>
                        <span style={{ color: '#57c7ff', fontWeight: 600 }}>portfolio</span>
                        <span style={{ color: '#c7c7c7' }}> ~ % </span>
                        <span style={{ color: '#e5e5e5' }}>{line.replace('visitor@portfolio ~ % ', '')}</span>
                      </span>
                    ) : (
                      line
                    )}
                  </div>
                )
              })}
            </div>

            {/* Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px 14px',
                background: '#1e1e1e',
                borderTop: '1px solid #2a2a2a',
                fontFamily: '"SF Mono", "Monaco", "Menlo", "Courier New", monospace',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#5af78e', fontWeight: 600 }}>visitor</span>
              <span style={{ color: '#c7c7c7' }}>@</span>
              <span style={{ color: '#57c7ff', fontWeight: 600 }}>portfolio</span>
              <span style={{ color: '#c7c7c7', marginRight: '8px' }}> ~ %</span>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    run(input)
                    setInput('')
                  }
                }}
                autoFocus
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#e5e5e5',
                  fontFamily: '"SF Mono", "Monaco", "Menlo", "Courier New", monospace',
                  fontSize: '13px',
                  caretColor: '#e5e5e5',
                }}
              />
            </div>
          </>
        )}

        {isMinimized && (
          <div
            style={{
              padding: '10px 16px',
              background: '#1e1e1e',
              fontFamily: '"SF Mono", "Monaco", "Menlo", monospace',
              fontSize: '12px',
              color: '#555',
              textAlign: 'center',
            }}
          >
            Terminal minimized · click yellow dot to expand
          </div>
        )}
      </div>
    </div>
  )
}
