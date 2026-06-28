'use client'

import { motion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { fadeUp, inViewport } from './motion-presets'

type AnimatedHeadingProps = {
  children: ReactNode
  /** Heading tag to render (default h2) */
  as?: ElementType
  /** Apply the animated emerald gradient text treatment */
  gradient?: boolean
  className?: string
}

/**
 * A heading that reveals on scroll and can use the brand gradient text.
 * Use inside custom layouts where <Section>'s built-in title isn't enough.
 */
export default function AnimatedHeading({
  children,
  as = 'h2',
  gradient = false,
  className = '',
}: AnimatedHeadingProps) {
  const Tag = motion[as as 'h2'] ?? motion.h2
  return (
    <Tag
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewport}
      className={`font-bold leading-tight ${gradient ? 'text-gradient-animated' : ''} ${className}`}
    >
      {children}
    </Tag>
  )
}
