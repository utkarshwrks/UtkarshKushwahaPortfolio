'use client'

import { motion } from 'framer-motion'
import {
  Code,
  Trophy,
  Zap,
  Star,
  Target,
  Flame,
  Cpu,
  Activity,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
import { fadeUp, staggerContainer, inViewport } from '@/components/ui/motion-presets'

export type CodingMilestone = {
  platform: string
  badge?: string
  title: string
  value: string
  subtitle?: string
  icon?: string
  color?: string
  link?: string
}

const ICON_MAP: Record<string, LucideIcon> = {
  code: Code,
  trophy: Trophy,
  zap: Zap,
  star: Star,
  target: Target,
  flame: Flame,
  cpu: Cpu,
  activity: Activity,
}

const PLATFORM_COLORS: Record<string, string> = {
  LeetCode: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
  Codeforces: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
  Custom: 'text-brand-300 bg-brand-500/10 border-brand-500/25',
}

function MilestoneCard({ item, index }: { item: CodingMilestone; index: number }) {
  const Icon = ICON_MAP[item.icon || 'code'] ?? Code
  const platformStyle =
    PLATFORM_COLORS[item.platform] ?? PLATFORM_COLORS['Custom']

  // parse gradient: if the user supplied Tailwind classes like "from-brand-400 to-brand-600"
  // we turn that into an inline style using CSS vars when it has brand tokens.
  // Otherwise we just use it as-is with bg-gradient-to-br.
  const gradientClass = item.color?.trim() || 'from-brand-400/20 to-brand-600/10'

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-[var(--r-lg)] border border-border bg-surface-1 p-4 shadow-md spotlight elevate"
    >
      {/* Gradient accent bar across the top */}
      <div
        className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${gradientClass} opacity-70 transition-opacity duration-300 group-hover:opacity-100`}
      />

      {/* Floating glow behind the icon */}
      <div
        className={`absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br ${gradientClass} opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-20`}
      />

      <div className="relative flex items-start justify-between gap-3">
        {/* Left: icon + platform */}
        <div className="flex flex-col gap-2">
          <div
            className={`inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} bg-opacity-10`}
          >
            <Icon className="h-4 w-4 text-brand-300" />
          </div>
          <span
            className={`inline-flex items-center gap-1 self-start rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${platformStyle}`}
          >
            {item.platform}
          </span>
        </div>

        {/* Right: external link + badge */}
        <div className="flex items-start gap-1.5">
          {item.badge && (
            <span className="text-base leading-none" aria-hidden>
              {item.badge}
            </span>
          )}
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1 text-subtle opacity-0 transition-all duration-200 hover:text-brand-300 group-hover:opacity-100"
              aria-label={`View ${item.title} on ${item.platform}`}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Value — the big stat */}
      <p
        className={`mt-3 bg-gradient-to-r ${gradientClass} bg-clip-text text-3xl font-extrabold leading-none tracking-tight text-transparent sm:text-4xl`}
      >
        {item.value}
      </p>

      {/* Title */}
      <p className="mt-1.5 text-sm font-semibold text-content">{item.title}</p>

      {/* Subtitle */}
      {item.subtitle && (
        <p className="mt-0.5 text-xs leading-relaxed text-muted line-clamp-2">{item.subtitle}</p>
      )}
    </motion.div>
  )
}

type Props = {
  items: CodingMilestone[]
}

/**
 * Bento-grid strip of programming skill / competitive programming milestones.
 * Returns null when the array is empty — completely invisible to visitors until
 * the admin adds at least one entry.
 */
export default function CodingMilestones({ items }: Props) {
  if (!items || items.length === 0) return null

  return (
    <motion.div
      variants={staggerContainer(0.07)}
      initial="hidden"
      whileInView="visible"
      viewport={inViewport}
      className="mb-16 sm:mb-20"
    >
      {/* Section eyebrow */}
      <motion.div variants={fadeUp} className="mb-6 flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
          <Zap className="h-3 w-3" />
          Skill Milestones
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </motion.div>

      {/* Bento grid — compact, 2→3→4 columns */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <MilestoneCard key={`${item.platform}-${item.title}-${i}`} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  )
}
