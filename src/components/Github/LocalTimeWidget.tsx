'use client'

import { useEffect, useState } from 'react'

const TZ = 'Asia/Kolkata'
const CITY = 'Jabalpur'

function phase(hour: number): { emoji: string; line: string } {
  if (hour >= 0 && hour < 5) return { emoji: '🌙', line: 'deep in the night shift — probably still coding' }
  if (hour < 9) return { emoji: '🌅', line: 'early grind, coffee loading' }
  if (hour < 12) return { emoji: '☀️', line: 'building things, fresh brain' }
  if (hour < 17) return { emoji: '⚡', line: 'heads-down, deep work mode' }
  if (hour < 21) return { emoji: '🌆', line: 'evening sprint in progress' }
  return { emoji: '🌙', line: 'night owl hours — best code after dark' }
}

export default function LocalTimeWidget() {
  // Render nothing time-specific until mounted → no SSR/client mismatch.
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  let time = '—'
  let hour = 12
  if (now) {
    time = new Intl.DateTimeFormat('en-US', {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(now)
    hour = Number(
      new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: '2-digit', hour12: false }).format(now),
    ) % 24
  }

  const { emoji, line } = phase(hour)

  return (
    <div className="group flex h-full items-center gap-4 rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-5 backdrop-blur-sm transition-colors hover:border-brand-500/30">
      <div className="text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden>
        {emoji}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-xl font-bold text-content tabular-nums" suppressHydrationWarning>
            {time}
          </span>
          <span className="text-xs text-muted">in {CITY}, IST</span>
          <span className="ml-1 flex items-center gap-1 text-[11px] text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
            live
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted">{line}</p>
      </div>
    </div>
  )
}
