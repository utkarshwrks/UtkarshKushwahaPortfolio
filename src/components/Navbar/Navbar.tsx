'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { name: 'ABOUT', href: '/about', isRoute: true, id: null },
  { name: 'PROJECTS', href: '#projects', isRoute: false, id: 'projects' },
  { name: 'SKILLS', href: '#skills', isRoute: false, id: 'skills' },
  { name: 'EXPERIENCE', href: '#experience', isRoute: false, id: 'experience' },
  { name: 'CONTACT', href: '#contact', isRoute: false, id: 'contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Scroll-aware chrome (elevation + condensed height once the user scrolls).
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Active-section tracking (homepage only) via IntersectionObserver.
  useEffect(() => {
    if (pathname !== '/') return
    const ids = navItems.map((i) => i.id).filter(Boolean) as string[]
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [pathname])

  // Keep the public chrome out of the admin panel.
  if (pathname?.startsWith('/admin')) return null

  const handleClick = (item: { href: string; isRoute: boolean }) => {
    setIsOpen(false)
    if (item.isRoute) {
      router.push(item.href)
    } else if (pathname === '/') {
      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/' + item.href)
    }
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-border bg-bg/80 shadow-[var(--shadow-md)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div
        className={`mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-1 font-mono text-lg font-bold md:text-xl">
          <span className="text-brand-neon transition-colors group-hover:text-content">$</span>
          <span className="text-content transition-colors group-hover:text-brand-neon">Utkarsh</span>
          <span className="text-brand-neon transition-colors group-hover:text-content">--dev</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = item.id !== null && active === item.id
            return (
              <button
                key={item.name}
                onClick={() => handleClick(item)}
                className={`relative rounded-[var(--r-md)] px-3 py-1.5 font-mono text-sm transition-colors duration-300 ${
                  isActive ? 'text-brand-neon' : 'text-muted hover:text-content'
                }`}
              >
                <span className="relative z-10">
                  &lt;{item.name}/&gt;
                </span>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    className="absolute inset-0 -z-0 rounded-[var(--r-md)] border border-brand-500/30 bg-brand-500/10"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-[var(--r-md)] p-2 text-brand-neon transition hover:bg-surface-2 md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navItems.map((item, i) => {
                const isActive = item.id !== null && active === item.id
                return (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleClick(item)}
                    className={`w-full rounded-[var(--r-md)] px-4 py-2.5 text-left font-mono text-base transition-colors ${
                      isActive ? 'bg-brand-500/10 text-brand-neon' : 'text-muted hover:bg-surface-2 hover:text-content'
                    }`}
                  >
                    &lt;{item.name}/&gt;
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
