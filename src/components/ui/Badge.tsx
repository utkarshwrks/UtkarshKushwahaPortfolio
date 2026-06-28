import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  /** Visual tone */
  tone?: 'brand' | 'success' | 'warning' | 'neutral'
  className?: string
  icon?: ReactNode
}

const TONES: Record<NonNullable<BadgeProps['tone']>, string> = {
  brand: 'border-brand-500/25 bg-brand-500/10 text-brand-300',
  success: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  neutral: 'border-border bg-surface-2 text-muted',
}

/** Small pill label — tech chips, ranks, tags, statuses. */
export default function Badge({ children, tone = 'brand', className = '', icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  )
}
