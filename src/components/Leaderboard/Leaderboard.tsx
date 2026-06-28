'use client'

import { ExternalLink, Users, Target, Rocket, Code2, Flag, Star, Crown, Award } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import leadershipData from '@/data/leadership.json'
import { siteCopy } from '@/lib/site-settings'

// Map the admin "icon" string -> a lucide icon. Unknown keys fall back to Users.
const ICONS: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  rocket: Rocket,
  code: Code2,
  flag: Flag,
  star: Star,
  crown: Crown,
  award: Award,
}

export default function Leadership() {
  const leaderships = leadershipData

  return (
    <div className="w-full py-12">
      <div className="mx-auto max-w-6xl px-2 sm:px-6">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
            <Users className="h-3.5 w-3.5" />
            {siteCopy.leadership.eyebrow}
          </span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            {siteCopy.leadership.title}{siteCopy.leadership.title ? ' ' : ''}
            <span className="text-gradient-animated">{siteCopy.leadership.highlight}</span>
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted">
            {siteCopy.leadership.subtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-5 md:flex-row md:gap-6">
          {leaderships.map((leadership, index) => {
            const Icon = ICONS[leadership.icon] ?? Users
            return (
            <div
              key={index}
              className="group relative flex-1 overflow-hidden rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-6 backdrop-blur-sm transition-all duration-300 hover:translate-y-[-4px] hover:border-brand-500/30 hover:shadow-[var(--shadow-md)]"
            >
              {/* Icon */}
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--r-md)] bg-gradient-to-br from-brand-500 to-brand-700 text-[var(--text-onbrand)] shadow-md transition-transform duration-300 group-hover:scale-105">
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="mb-1 text-xl font-bold text-content">{leadership.title}</h3>
              <p className="mb-3 font-semibold text-brand-300">{leadership.role}</p>
              <p className="mb-4 text-sm leading-relaxed text-muted">{leadership.description}</p>

              <a
                href={leadership.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[var(--r-md)] border border-border bg-surface-2 px-3 py-1.5 text-sm font-medium text-content transition-all duration-300 hover:border-brand-500/40 hover:bg-surface-3"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Learn More
              </a>
            </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}