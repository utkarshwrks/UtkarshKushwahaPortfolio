'use client'
import Image from 'next/image'
import { ExternalLink, Briefcase } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useRef, type ReactNode } from 'react'
import experiencesData from '@/data/experience.json'
import { siteCopy } from '@/lib/site-settings'

const EASE = [0.16, 1, 0.3, 1] as const

type Experience = {
  logo: string
  company: string
  role: string
  time: string
  points: string[]
  certLink?: string
}

// Per-role accent (cohesive emerald → teal → cyan family) so the section
// has life and rhythm without turning into a rainbow.
const ACCENTS = [
  { rgb: '16, 185, 129', text: 'text-brand-300', dot: 'bg-brand-400' }, // emerald
  { rgb: '45, 212, 191', text: 'text-teal-300', dot: 'bg-teal-400' }, // teal
  { rgb: '34, 211, 238', text: 'text-cyan-300', dot: 'bg-cyan-400' }, // cyan
]

// Highlight numeric metrics inline (92%, 40%, 5+, 500+) — skips 4-digit years.
// (?!\d) ensures we don't grab "202" out of "2025".
function highlightMetrics(text: string, accentText: string): ReactNode[] {
  const parts = text.split(/(\b\d{1,3}(?!\d)\+?%?)/g)
  return parts.map((p, i) =>
    /^\d{1,3}\+?%?$/.test(p) ? (
      <span key={i} className={`font-semibold ${accentText}`}>
        {p}
      </span>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

// Pick the headline metric for the big watermark (first metric-looking token).
function headlineMetric(points: string[]): string | null {
  for (const p of points) {
    const m = p.match(/\b\d{1,3}(?!\d)\+?%?/)
    if (m) return m[0]
  }
  return null
}

function TimelineItem({ exp, index }: { exp: Experience; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.25 })
  const cardRef = useRef<HTMLDivElement>(null)
  const accent = ACCENTS[index % ACCENTS.length]
  const isCurrent = /present|current/i.test(exp.time)
  const watermark = headlineMetric(exp.points)

  // 3D tilt driven by cursor position.
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 })

  function onMove(e: React.MouseEvent) {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    mx.set(x)
    my.set(y)
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
  }
  function onLeave() {
    mx.set(0.5)
    my.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
      className="relative pl-16 sm:pl-20"
      style={{ perspective: 1000 }}
    >
      {/* Node: logo on the spine with accent glow ring */}
      <div className="absolute left-0 top-1 z-10 flex h-12 w-12 items-center justify-center sm:h-14 sm:w-14">
        <span
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: `rgba(${accent.rgb}, 0.25)` }}
        />
        <div
          className="relative h-12 w-12 overflow-hidden rounded-full bg-surface-2 p-1.5 transition-transform duration-300 hover:scale-110 sm:h-14 sm:w-14"
          style={{ border: `1px solid rgba(${accent.rgb}, 0.5)` }}
        >
          <Image
            src={exp.logo}
            alt={`${exp.company} logo`}
            width={56}
            height={56}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        {isCurrent && (
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${accent.dot} opacity-60`} />
            <span className={`relative inline-flex h-3.5 w-3.5 rounded-full ${accent.dot}`} />
          </span>
        )}
      </div>

      {/* Card with tilt */}
      <motion.div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative overflow-hidden rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-5 backdrop-blur-sm transition-shadow duration-300 sm:p-6"
        whileHover={{ boxShadow: `0 24px 60px -20px rgba(${accent.rgb}, 0.35)` }}
      >
        {/* Animated gradient-glow border (revealed on hover) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--r-lg)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            padding: '1px',
            background: `linear-gradient(130deg, rgba(${accent.rgb},0.6), transparent 35%, transparent 65%, rgba(${accent.rgb},0.4))`,
            WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Cursor-follow spotlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[var(--r-lg)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 0%), rgba(${accent.rgb}, 0.14), transparent 60%)`,
          }}
        />

        {/* Giant metric watermark */}
        {watermark && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-5 select-none text-[6.5rem] font-black leading-none tracking-tighter opacity-[0.07] sm:text-[8rem]"
            style={{ color: `rgb(${accent.rgb})` }}
          >
            {watermark}
          </span>
        )}

        {/* Content */}
        <div className="relative" style={{ transform: 'translateZ(40px)' }}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-content transition-colors group-hover:text-content sm:text-xl">
                  {exp.company}
                </h3>
                {isCurrent && (
                  <span
                    className="inline-flex items-center gap-1 rounded-[var(--r-pill)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      color: `rgb(${accent.rgb})`,
                      background: `rgba(${accent.rgb}, 0.12)`,
                      border: `1px solid rgba(${accent.rgb}, 0.3)`,
                    }}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${accent.dot} [animation:pulse-glow_1.6s_ease-in-out_infinite]`} />
                    Now
                  </span>
                )}
              </div>
              <p className={`mt-0.5 text-sm font-medium ${accent.text}`}>{exp.role}</p>
            </div>
            <span className="shrink-0 rounded-[var(--r-pill)] border border-border bg-surface-2 px-3 py-1 font-mono text-xs font-medium text-muted">
              {exp.time}
            </span>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {exp.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full"
                  style={{ background: `rgb(${accent.rgb})` }}
                />
                <span>{highlightMetrics(point, accent.text)}</span>
              </li>
            ))}
          </ul>

          {exp.certLink && (
            <a
              href={exp.certLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${accent.text} transition-opacity hover:opacity-80`}
            >
              View Certificate
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ExperienceSection() {
  const experiences = experiencesData as Experience[]

  return (
    <section
      id="experience"
      className="relative mx-auto w-full max-w-[var(--container)] px-5 py-16 sm:px-8"
    >
      {/* Heading */}
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300"
        >
          <Briefcase className="h-3.5 w-3.5" />
          {siteCopy.experience.eyebrow}
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
        >
          {siteCopy.experience.title}{siteCopy.experience.title ? ' ' : ''}
          <span className="text-gradient-animated">{siteCopy.experience.highlight}</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="max-w-xl text-base leading-relaxed text-muted"
        >
          {siteCopy.experience.subtitle}
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="relative mx-auto max-w-3xl">
        {/* Flowing gradient spine */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.1, ease: EASE }}
          className="absolute bottom-2 left-6 top-3 w-[2px] origin-top rounded-full sm:left-7"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,185,129,0.6), rgba(45,212,191,0.45), rgba(34,211,238,0.3), transparent)',
            backgroundSize: '100% 200%',
            animation: 'spine-flow 6s linear infinite',
          }}
        />
        <div className="flex flex-col gap-8">
          {experiences.map((exp, i) => (
            <TimelineItem key={i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
