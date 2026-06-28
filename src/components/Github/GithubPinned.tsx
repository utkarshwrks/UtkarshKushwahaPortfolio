'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, FolderGit2, Star, Users, Activity, Wrench, Briefcase, Trophy } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import CountUp from '@/components/Hero/CountUp'
import LocalTimeWidget from './LocalTimeWidget'
import skills from '@/data/skills.json'
import achievements from '@/data/achievements.json'
import { defaultSettings, siteCopy } from '@/lib/site-settings'

const ABOUT = defaultSettings.about ?? { bio: '', funFacts: [] }
const C = siteCopy.about

// Split a "☕ Fueled by chai" fun-fact string into emoji + label.
function splitFact(s: string): { emoji: string; label: string } {
  const trimmed = s.trim()
  const space = trimmed.indexOf(' ')
  if (space === -1) return { emoji: '', label: trimmed }
  return { emoji: trimmed.slice(0, space), label: trimmed.slice(space + 1) }
}

const FUN_HOVER = { rotate: [0, -12, 12, 0], y: [0, -4, 0], transition: { duration: 0.6 } }

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

type Profile = { ok: boolean; repos?: number; stars?: number; followers?: number; contributions?: number }

// Shown if the GitHub API is unreachable (e.g. no token in a given env).
const FALLBACK = { repos: 25, contributions: 200, stars: 8, followers: 20 }

function GitHubStat({
  icon,
  value,
  label,
  loading,
  live,
  suffix = '',
}: {
  icon: React.ReactNode
  value: number
  label: string
  loading: boolean
  live: boolean
  suffix?: string
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -5 }}
      className="group relative flex flex-col items-center gap-1.5 overflow-hidden rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-5 text-center backdrop-blur-sm transition-colors duration-300 hover:border-brand-500/30"
    >
      {live && (
        <span className="absolute right-2.5 top-2.5 flex items-center gap-1 text-[10px] font-medium text-brand-300/80">
          <span className="h-1 w-1 animate-pulse rounded-full bg-brand-400" /> live
        </span>
      )}
      <span className="text-2xl text-brand-400 transition-transform duration-500 group-hover:scale-110">{icon}</span>
      {loading ? (
        <span className="my-1 h-7 w-12 animate-pulse rounded bg-surface-3" />
      ) : (
        <span className="text-2xl font-bold text-gradient sm:text-[1.65rem]">
          <CountUp to={value} suffix={suffix} />
        </span>
      )}
      <span className="text-xs leading-tight text-muted">{label}</span>
    </motion.div>
  )
}

function MiniStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className="group flex items-center gap-3 rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-4 backdrop-blur-sm transition-colors duration-300 hover:border-brand-500/30"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--r-md)] bg-brand-500/10 text-brand-400 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
      <div>
        <div className="text-lg font-bold text-content">{value}</div>
        <div className="text-xs text-muted">{label}</div>
      </div>
    </motion.div>
  )
}

const FUN_FACTS = ABOUT.funFacts.map(splitFact)

export default function AboutGithubSection() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.2 })
  const [bentoRef, bentoInView] = useInView({ triggerOnce: true, threshold: 0.15 })

  useEffect(() => {
    let alive = true
    fetch('/api/github/profile')
      .then((r) => r.json())
      .then((d) => alive && setProfile(d))
      .catch(() => alive && setProfile({ ok: false }))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const live = !!profile?.ok
  const v = live ? profile! : FALLBACK
  const repos = v.repos ?? FALLBACK.repos
  const contributions = v.contributions ?? FALLBACK.contributions
  const stars = v.stars ?? FALLBACK.stars
  const followers = v.followers ?? FALLBACK.followers

  return (
    <section className="relative mx-auto w-full max-w-[var(--container)] px-5 py-20 sm:px-8">
      {/* Heading */}
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 [animation:pulse-glow_2s_ease-in-out_infinite]" />
          {C.eyebrow}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
        >
          {C.title} <span className="text-gradient-animated">{C.highlight}</span>
        </motion.h2>
      </div>

      {/* Live GitHub stats */}
      <motion.div
        ref={statsRef}
        variants={container}
        initial="hidden"
        animate={statsInView ? 'visible' : 'hidden'}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <GitHubStat icon={<FolderGit2 />} value={repos} suffix="+" label="Public Repositories" loading={loading} live={live} />
        <GitHubStat icon={<Activity />} value={contributions} label="Contributions (1y)" loading={loading} live={live} />
        <GitHubStat icon={<Star />} value={stars} label="Stars Earned" loading={loading} live={live} />
        <GitHubStat icon={<Users />} value={followers} label="GitHub Followers" loading={loading} live={live} />
      </motion.div>

      {/* Bento */}
      <motion.div
        ref={bentoRef}
        variants={container}
        initial="hidden"
        animate={bentoInView ? 'visible' : 'hidden'}
        className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3"
      >
        {/* Who am I — wide anchor */}
        <motion.div
          variants={item}
          className="rounded-[var(--r-lg)] border border-border bg-surface-1/40 p-6 backdrop-blur-sm sm:p-8 lg:col-span-2"
        >
          <h3 className="mb-4 text-2xl font-semibold text-content">
            Who am <span className="text-gradient">I?</span>
          </h3>
          <p className="text-base leading-relaxed text-muted">{ABOUT.bio}</p>
          <a
            href="/about"
            className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition-colors hover:text-brand-neon"
          >
            Know more
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        {/* Local time */}
        <motion.div variants={item} className="lg:col-span-1">
          <LocalTimeWidget />
        </motion.div>

        {/* Derived mini stats */}
        <MiniStat icon={<Wrench className="h-5 w-5" />} value={`${skills.length}+`} label="Tools in Stack" />
        <MiniStat icon={<Briefcase className="h-5 w-5" />} value={siteCopy.aboutExperienceValue} label="Experience" />
        <MiniStat icon={<Trophy className="h-5 w-5" />} value={`${achievements.length}`} label="Hackathon Wins" />
      </motion.div>

      {/* Fun facts with playful hover */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-4 grid gap-4 sm:grid-cols-3"
      >
        {FUN_FACTS.map((fact) => (
          <motion.div
            key={fact.label}
            variants={item}
            whileHover="hover"
            className="flex items-center gap-4 rounded-[var(--r-lg)] border border-border bg-surface-1/40 px-5 py-4 backdrop-blur-sm transition-colors hover:border-brand-500/30"
          >
            <motion.span className="text-2xl" variants={{ hover: FUN_HOVER }}>
              {fact.emoji}
            </motion.span>
            <span className="font-medium text-content">{fact.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
