'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp } from './motion-presets'

type CardProps = {
  children: ReactNode
  className?: string
  /** glass = frosted translucent; solid = surface gradient card */
  variant?: 'glass' | 'solid'
  /** Lift + emerald glow on hover */
  interactive?: boolean
  /** Add a brand-tinted gradient hairline border */
  gradientBorder?: boolean
  /** Reveal on scroll using the shared fadeUp variant */
  reveal?: boolean
  onClick?: () => void
}

/**
 * The base surface used for every card across the site (projects, certs,
 * testimonials, etc.). Composes the .glass / .surface-card utilities so the
 * look stays consistent and theme-driven.
 */
export default function Card({
  children,
  className = '',
  variant = 'glass',
  interactive = false,
  gradientBorder = false,
  reveal = false,
  onClick,
}: CardProps) {
  const base =
    variant === 'glass'
      ? 'glass rounded-[var(--r-lg)]'
      : 'surface-card'

  const motionProps = reveal
    ? {
        variants: fadeUp,
        initial: 'hidden' as const,
        whileInView: 'visible' as const,
        viewport: { once: true, amount: 0.2 },
      }
    : {}

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      whileHover={interactive ? { y: -4 } : undefined}
      className={[
        base,
        gradientBorder ? 'border-gradient' : '',
        interactive ? 'glow-hover cursor-pointer' : '',
        'relative overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </motion.div>
  )
}
