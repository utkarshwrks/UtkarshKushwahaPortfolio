'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { fadeUp, staggerContainer, inViewport } from './motion-presets'

type SectionProps = {
  id?: string
  /** Small uppercase label above the title */
  eyebrow?: string
  /** Main section heading (rendered via AnimatedHeading styling) */
  title?: ReactNode
  /** Supporting line under the title */
  subtitle?: ReactNode
  children: ReactNode
  className?: string
  /** Center the header block */
  centered?: boolean
  /** Constrain inner width (default true). Set false for full-bleed content. */
  contained?: boolean
}

/**
 * Standard section shell: consistent vertical rhythm, max-width container,
 * and an optional animated header (eyebrow + title + subtitle) that reveals
 * on scroll. Every page section is meant to wrap its content in this.
 */
export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className = '',
  centered = false,
  contained = true,
}: SectionProps) {
  const hasHeader = eyebrow || title || subtitle
  return (
    <section id={id} className={`section-pad relative ${className}`}>
      <div className={contained ? 'mx-auto w-full max-w-[var(--container)] px-5 sm:px-8' : ''}>
        {hasHeader && (
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={inViewport}
            className={`mb-12 flex flex-col gap-3 ${centered ? 'items-center text-center' : 'items-start'}`}
          >
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400 [animation:pulse-glow_2s_ease-in-out_infinite]" />
                {eyebrow}
              </motion.span>
            )}
            {title && (
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                variants={fadeUp}
                className={`max-w-2xl text-base leading-relaxed text-muted ${centered ? 'mx-auto' : ''}`}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  )
}
