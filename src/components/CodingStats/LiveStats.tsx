'use client'

import { useCallback, useEffect, useState } from 'react'
import { SiLeetcode, SiCodeforces } from 'react-icons/si'
import { Loader2, Trophy, Target, TrendingUp, Hash, RefreshCw } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { siteCopy } from '@/lib/site-settings'

type RatingPoint = { name: string; date: number; rating: number }

type Stats = {
  leetcode: {
    total: number
    easy: number
    medium: number
    hard: number
    totalEasy: number
    totalMedium: number
    totalHard: number
    ranking: number | null
    contestRating: number | null
    contestCount: number
    topPercentage: number | null
    ratingHistory: RatingPoint[]
  } | null
  codeforces: {
    handle: string
    rating: number | null
    maxRating: number | null
    rank: string | null
    solved: number
    ratingHistory: RatingPoint[]
  } | null
}

const DIFF = {
  Easy: '#22c55e',
  Medium: '#f59e0b',
  Hard: '#ef4444',
} as const

export default function LiveStats() {
  const [data, setData] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      // bust any intermediate cache so freshly-solved problems show up
      const res = await fetch(`/api/stats?t=${Date.now()}`, { cache: 'no-store' })
      const d = await res.json()
      setData(d)
    } catch {
      setData((prev) => prev ?? { leetcode: null, codeforces: null })
    }
  }, [])

  // initial load
  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  // re-fetch whenever the user returns to the tab (e.g. after solving a problem)
  useEffect(() => {
    const onFocus = () => {
      if (document.visibilityState === 'visible') {
        setRefreshing(true)
        load().finally(() => setRefreshing(false))
      }
    }
    document.addEventListener('visibilitychange', onFocus)
    window.addEventListener('focus', onFocus)
    return () => {
      document.removeEventListener('visibilitychange', onFocus)
      window.removeEventListener('focus', onFocus)
    }
  }, [load])

  const refresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const lc = data?.leetcode
  const cf = data?.codeforces

  return (
    <div className="mx-auto w-full max-w-[var(--container)] px-5 sm:px-8">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 [animation:pulse-glow_2s_ease-in-out_infinite]" />
          {siteCopy.codingStats.eyebrow}
        </span>
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {siteCopy.codingStats.title}
          {siteCopy.codingStats.title ? ' ' : ''}
          <span className="text-gradient-animated">{siteCopy.codingStats.highlight}</span>
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          {siteCopy.codingStats.subtitle}
        </p>
        <button
          onClick={refresh}
          disabled={refreshing || loading}
          className="inline-flex items-center gap-1.5 rounded-[var(--r-pill)] border border-border bg-surface-1/60 px-3 py-1 text-xs text-muted backdrop-blur-sm transition-colors hover:border-brand-500/40 hover:text-content disabled:opacity-60"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin text-brand-400' : ''}`} />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted">
          <Loader2 className="h-5 w-5 animate-spin text-brand-400" /> Fetching latest stats…
        </div>
      ) : (
        <div className="grid items-start gap-5 md:grid-cols-2">
          {/* ---------------- LeetCode ---------------- */}
          <div className="rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-5 backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SiLeetcode className="h-5 w-5 text-amber-400" />
                <h3 className="font-semibold text-content">LeetCode</h3>
              </div>
              {lc?.ranking != null && (
                <span className="inline-flex items-center gap-1 rounded-[var(--r-pill)] border border-border bg-surface-2/60 px-2.5 py-1 font-mono text-xs text-muted">
                  <Hash className="h-3 w-3" />
                  {lc.ranking.toLocaleString()}
                </span>
              )}
            </div>

            {lc ? (
              <>
                {/* headline numbers */}
                <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-gradient text-4xl font-bold">{lc.total}</span>
                    <span className="text-sm text-muted">solved</span>
                  </div>
                  {lc.contestRating != null && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-content">{lc.contestRating}</span>
                      <span className="text-xs text-muted">
                        contest rating
                        {lc.topPercentage != null ? ` · top ${lc.topPercentage}%` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* difficulty breakdown */}
                <div className="mb-5 space-y-3">
                  <DiffRow label="Easy" solved={lc.easy} total={lc.totalEasy} color={DIFF.Easy} />
                  <DiffRow label="Medium" solved={lc.medium} total={lc.totalMedium} color={DIFF.Medium} />
                  <DiffRow label="Hard" solved={lc.hard} total={lc.totalHard} color={DIFF.Hard} />
                </div>

                {/* contest rating chart */}
                <RatingChart
                  id="lc"
                  label="Contest rating"
                  data={lc.ratingHistory}
                  color="#fbbf24"
                  emptyText="No rated contests yet"
                />
              </>
            ) : (
              <Fallback text="400+ problems solved across LeetCode & Codeforces." />
            )}
          </div>

          {/* ---------------- Codeforces ---------------- */}
          <div className="rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-5 backdrop-blur-sm sm:p-6">
            <div className="mb-5 flex items-center gap-2">
              <SiCodeforces className="h-5 w-5 text-brand-400" />
              <h3 className="font-semibold text-content">Codeforces</h3>
            </div>

            {cf ? (
              <>
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <Stat icon={<Target className="h-4 w-4" />} label="Solved" value={cf.solved || '—'} />
                  <Stat icon={<TrendingUp className="h-4 w-4" />} label="Rating" value={cf.rating ?? '—'} />
                  <Stat icon={<Trophy className="h-4 w-4" />} label="Max rating" value={cf.maxRating ?? '—'} />
                  <Stat icon={<Trophy className="h-4 w-4" />} label="Rank" value={cf.rank ?? '—'} capitalize />
                </div>

                <RatingChart
                  id="cf"
                  label="Rating history"
                  data={cf.ratingHistory}
                  color="#34d399"
                  emptyText="No rated contests yet"
                />
              </>
            ) : (
              <Fallback text="Active on Codeforces — competitive programming across contests." />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------ pieces ------------------------------ */

function DiffRow({
  label,
  solved,
  total,
  color,
}: {
  label: string
  solved: number
  total: number
  color: string
}) {
  const pct = total > 0 ? Math.min(100, (solved / total) * 100) : 0
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-mono text-subtle">
          <span className="text-content">{solved}</span>
          {total > 0 ? ` / ${total}` : ''}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full transition-[width] duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

const fmtDate = (ms: number) =>
  new Date(ms).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })

function RatingChart({
  id,
  label,
  data,
  color,
  emptyText,
}: {
  id: string
  label: string
  data: RatingPoint[]
  color: string
  emptyText: string
}) {
  const enough = Array.isArray(data) && data.length >= 2

  // Honest, padded domain rounded to the nearest 50 so the axis reads in real
  // rating units instead of zooming every tiny fluctuation to full height.
  let domain: [number, number] = [0, 0]
  let peak = 0
  let low = 0
  let current = 0
  if (enough) {
    const vals = data.map((d) => d.rating)
    low = Math.min(...vals)
    peak = Math.max(...vals)
    current = data[data.length - 1].rating
    const pad = Math.max(40, Math.round((peak - low) * 0.25))
    domain = [Math.max(0, Math.floor((low - pad) / 50) * 50), Math.ceil((peak + pad) / 50) * 50]
  }

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-subtle">{label}</p>
        {enough && (
          <p className="font-mono text-[0.7rem] text-subtle">
            now <span className="text-content">{current}</span> · peak {peak}
          </p>
        )}
      </div>
      {enough ? (
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 8, bottom: 2, left: -8 }}>
              <defs>
                <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1d262b" vertical={false} />
              <XAxis
                dataKey="date"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={fmtDate}
                tick={{ fill: '#62716c', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={36}
              />
              <YAxis
                domain={domain}
                width={38}
                tick={{ fill: '#62716c', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tickCount={4}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#1d262b' }} />
              <Area
                type="monotone"
                dataKey="rating"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${id})`}
                dot={false}
                activeDot={{ r: 3, fill: color }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-[var(--r-md)] border border-dashed border-border text-xs text-subtle">
          {emptyText}
        </div>
      )}
    </div>
  )
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: RatingPoint }>
}) {
  if (!active || !payload?.length) return null
  const p = payload[0].payload
  return (
    <div className="rounded-[var(--r-md)] border border-border bg-surface-1 px-3 py-2 text-xs shadow-lg">
      <div className="font-semibold text-content">{p.rating}</div>
      {p.name ? <div className="max-w-[200px] truncate text-muted">{p.name}</div> : null}
    </div>
  )
}

function Stat({
  icon,
  label,
  value,
  capitalize,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  capitalize?: boolean
}) {
  return (
    <div className="rounded-[var(--r-md)] border border-border bg-surface-2/50 p-3">
      <div className="mb-1 flex items-center gap-1.5 text-xs text-muted">
        {icon} {label}
      </div>
      <div className={`text-xl font-bold text-content ${capitalize ? 'capitalize' : ''}`}>{value}</div>
    </div>
  )
}

function Fallback({ text }: { text: string }) {
  return (
    <div className="text-sm text-muted">
      <p className="text-gradient mb-1 text-3xl font-bold">400+</p>
      <p>{text}</p>
      <p className="mt-2 text-xs text-subtle">Set your handles in env vars to show live numbers here.</p>
    </div>
  )
}
