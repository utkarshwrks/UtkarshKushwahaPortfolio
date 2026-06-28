'use client'
import { useState, useRef, useEffect } from 'react'
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react'
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
  const [output, setOutput] = useState<string[]>(['Welcome to portfolio terminal! 🚀', 'Type "help" to see available commands.'])
  const [input, setInput] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(false) // Changed to false by default
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  // Focus input when terminal is opened
  useEffect(() => {
    if (isVisible && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isVisible, isMinimized])

  function run(cmd: string) {
    const c = cmd.trim().toLowerCase()
    if (!c) return

    // Add command to output
    setOutput(o => [...o, `➜ ${cmd}`])

    // Process commands
    switch(c) {
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
        setOutput(o => [...o, '🔗 Opening GitHub profile...'])
        break
      default:
        if (c.startsWith('cd ')) {
          const dir = c.split(' ')[1]
          const sections: { [key: string]: string } = {
            home: 'home',
            about: '/about',
            projects: 'projects', 
            skills: 'skills',
            contact: 'contact'
          }
          
          const sectionId = sections[dir]
          if (sectionId) {
            const el = document.getElementById(sectionId)
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              setOutput(o => [...o, `📍 Navigating to ${dir} section...`])
            } else {
              setOutput(o => [...o, '❌ Section not found in DOM'])
            }
          } else {
            setOutput(o => [...o, '❌ Invalid section. Available: home, about, projects, skills, contact'])
          }
        } else {
          setOutput(o => [...o, '❌ Command not found. Type "help" for available commands.'])
        }
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="flex items-center gap-2 rounded-[var(--r-md)] bg-brand-500 p-3 font-medium text-[var(--text-onbrand)] shadow-[0_8px_30px_-8px_var(--glow-brand)] transition-all duration-300 hover:scale-105 hover:bg-brand-400"
        >
          <Terminal className="w-5 h-5" />
          <span>Open Terminal</span>
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-8 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80' : 'w-96'
    }`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between rounded-t-lg border-b border-border bg-surface-2 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-content">portfolio-terminal</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-surface-3 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3 text-muted" /> : <Minimize2 className="w-3 h-3 text-muted" />}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-red-500 rounded transition-colors"
          >
            <X className="w-3 h-3 text-muted hover:text-white" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="rounded-b-lg border border-border bg-surface-1/95 shadow-2xl backdrop-blur-sm">
        {!isMinimized && (
          <>
            {/* Output Area */}
            <div 
              ref={terminalRef}
              className="h-48 overflow-auto p-4 text-sm font-mono"
            >
              {output.map((line, i) => (
                <div 
                  key={i} 
                  className={`whitespace-pre-wrap leading-relaxed ${
                    line.startsWith('❌') ? 'text-red-400' : 
                    line.startsWith('📍') ? 'text-blue-400' :
                    line.startsWith('🔗') ? 'text-cyan-400' :
                    line.startsWith('➜') ? 'text-brand-400 font-semibold' :
                    line.includes('🚀') ? 'text-amber-400' :
                    'text-muted'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-brand-400">➜</span>
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent font-mono text-content outline-none placeholder:text-subtle"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      run(input)
                      setInput('')
                    }
                  }}
                  placeholder="Type a command..."
                  autoFocus
                />
                <button
                  onClick={() => { run(input); setInput('') }}
                  className="rounded bg-brand-500 px-3 py-1 font-mono text-xs font-semibold text-[var(--text-onbrand)] transition-colors hover:bg-brand-400"
                >
                  Run
                </button>
              </div>
              <div className="mt-2 font-mono text-xs text-subtle">
                Tip: Try &quot;help&quot; to see all commands • Press Enter to execute
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-4 text-center">
            <div className="text-muted text-sm font-mono">
              Terminal minimized • Click maximize to open
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
