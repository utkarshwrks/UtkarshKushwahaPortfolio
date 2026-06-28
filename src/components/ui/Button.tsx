'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  icon?: ReactNode
  iconRight?: ReactNode
  className?: string
}

type ButtonAsButton = CommonProps & {
  href?: undefined
  onClick?: () => void
  type?: 'button' | 'submit'
}

type ButtonAsLink = CommonProps & {
  href: string
  download?: boolean
  target?: string
  rel?: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-500 text-[var(--text-onbrand)] font-semibold hover:bg-brand-400 shadow-[0_8px_30px_-8px_var(--glow-brand)]',
  outline:
    'border border-brand-500/50 text-brand-300 hover:bg-brand-500/10 hover:border-brand-400',
  ghost: 'text-muted hover:text-content hover:bg-surface-2',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

/** Brand button — renders as <a> when `href` is provided, else <button>. */
export default function Button(props: ButtonProps) {
  const { children, variant = 'primary', size = 'md', icon, iconRight, className = '' } = props
  const classes = `inline-flex items-center justify-center rounded-[var(--r-md)] transition-colors duration-[var(--dur-mid)] ${VARIANTS[variant]} ${SIZES[size]} ${className}`

  const inner = (
    <>
      {icon}
      {children}
      {iconRight}
    </>
  )

  const hover = { scale: 1.04, y: -2 }
  const tap = { scale: 0.97 }

  if ('href' in props && props.href !== undefined) {
    return (
      <motion.a
        href={props.href}
        download={props.download}
        target={props.target}
        rel={props.rel}
        whileHover={hover}
        whileTap={tap}
        className={classes}
      >
        {inner}
      </motion.a>
    )
  }

  return (
    <motion.button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      whileHover={hover}
      whileTap={tap}
      className={classes}
    >
      {inner}
    </motion.button>
  )
}
