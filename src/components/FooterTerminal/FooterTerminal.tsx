'use client'
import { useState, useRef, useEffect } from 'react'
import { Terminal, X, Minimize2, Maximize2 } from 'lucide-react'

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
        setOutput(o => [...o, '👨‍💻 Utkarsh Kushwaha | Full-Stack Developer', 'Passionate about building digital experiences that matter 🚀'])
        break
      case 'skills':
        setOutput(o => [...o, '💼 Tech Stack:', 'Frontend: React, Next.js, TypeScript, Tailwind', 'Backend: Node.js, Django, Python', 'Database: MongoDB, PostgreSQL, Firebase', 'Tools: Git, Docker, AWS, Vercel'])
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
          className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
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
      <div className="bg-zinc-800 rounded-t-lg border-b border-zinc-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-white text-sm font-medium">portfolio-terminal</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-zinc-700 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3 text-zinc-400" /> : <Minimize2 className="w-3 h-3 text-zinc-400" />}
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-red-500 rounded transition-colors"
          >
            <X className="w-3 h-3 text-zinc-400 hover:text-white" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-b-lg shadow-2xl">
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
                    line.startsWith('➜') ? 'text-green-400 font-semibold' :
                    line.includes('🚀') ? 'text-yellow-400' :
                    'text-zinc-300'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-700 p-4">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-mono">➜</span>
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent outline-none text-zinc-100 font-mono placeholder-zinc-500"
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
                  className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-mono"
                >
                  Run
                </button>
              </div>
              <div className="text-xs text-zinc-500 mt-2 font-mono">
                Tip: Try "help" to see all commands • Press Enter to execute
              </div>
            </div>
          </>
        )}

        {isMinimized && (
          <div className="p-4 text-center">
            <div className="text-zinc-400 text-sm font-mono">
              Terminal minimized • Click maximize to open
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
