'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { name: 'ABOUT', href: '/about', isRoute: true },
  { name: 'PROJECTS', href: '#projects', isRoute: false },
  { name: 'SKILLS', href: '#skills', isRoute: false },
  { name: 'EXPERIENCE', href: '#experience', isRoute: false },
  { name: 'CONTACT', href: '#contact', isRoute: false },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (item: { href: string; isRoute: boolean }) => {
    setIsOpen(false)

    if (item.isRoute) {
      // Direct page navigation
      router.push(item.href)
    } else {
      // Section links
      if (pathname === '/') {
        // Already on homepage → smooth scroll
        const target = document.querySelector(item.href)
        target?.scrollIntoView({ behavior: 'smooth' })
      } else {
        // On another page → go back to homepage with hash
        router.push('/' + item.href)
      }
    }
  }

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md shadow-md border-b border-green-500/10">
     <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">

        {/* Logo / Name */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold flex items-center gap-1 group"
        >
          <span className="text-[#22ff99] group-hover:text-white transition-colors">$</span>
          <span className="text-white group-hover:text-[#22ff99] transition-colors">Utkarsh</span>
          <span className="text-[#22ff99] group-hover:text-white transition-colors">--dev</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              className="text-[#22ff99] hover:text-white hover:drop-shadow-[0_0_6px_#22ff99] transition duration-300"
            >
              &lt;{item.name}/&gt;
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-green-900/10 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen 
            ? <X size={24} className="text-[#22ff99]" /> 
            : <Menu size={24} className="text-[#22ff99]" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black shadow-lg py-4 border-t border-green-500/10 flex flex-col items-center space-y-4"
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleClick(item)}
                className="w-full text-center text-[#22ff99] hover:text-white hover:drop-shadow-[0_0_6px_#22ff99] transition duration-300 text-lg"
              >
                &lt;{item.name}/&gt;
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
