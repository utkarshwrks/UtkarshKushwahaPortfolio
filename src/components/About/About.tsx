'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { SiGithub, SiLinkedin } from 'react-icons/si'
import { Mail, FileText } from 'lucide-react'
import { siteCopy, defaultSettings } from '@/lib/site-settings'
import LifeScene from './LifeScene'

const EASE = [0.16, 1, 0.3, 1] as const

const { about, socials, hero } = defaultSettings

// "1.5+ yrs" -> "1.5+"
const expValue = siteCopy.aboutExperienceValue.replace(/yrs?|years?/i, '').trim()

// split the bio into two paragraphs for the reference's rhythm
const sentences = about.bio.split(/(?<=\.)\s+/).filter(Boolean)
const mid = Math.ceil(sentences.length / 2)
const para1 = sentences.slice(0, mid).join(' ')
const para2 = sentences.slice(mid).join(' ')

const education = [
  {
    title: 'B.Tech — CSE (AI & ML)',
    period: '2024 – 2028',
    org: 'Gyan Ganga Institute of Technology & Science, Jabalpur',
    meta: 'CGPA 7.33',
  },
  {
    title: 'Class XII — PCM + IP',
    period: 'CBSE',
    org: 'Nachiketa Sr. Sec. School, Jabalpur',
    meta: '84%',
  },
  {
    title: 'Class X — IT',
    period: 'CBSE',
    org: 'Nachiketa Sr. Sec. School, Jabalpur',
    meta: '80%',
  },
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay: i * 0.12 },
  }),
}

export default function About() {
  return (
    <section className="relative px-5 pb-20 pt-28 text-content sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[var(--container)]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-10 font-mono text-xs tracking-[0.25em] text-brand-300"
        >
          $ cat about.md
        </motion.p>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* ---------------- Left: experience + photo ---------------- */}
          <motion.div
            variants={reveal}
            custom={0}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="mb-7 flex items-center gap-4">
              <span className="text-gradient text-6xl font-bold leading-none sm:text-7xl">{expValue}</span>
              <div className="leading-tight">
                <div className="text-lg font-semibold text-content">Years</div>
                <div className="text-lg font-semibold text-content">Experience</div>
                <div className="mt-1 text-sm text-muted">Full-Stack &amp; AI Developer</div>
              </div>
            </div>

            <div className="relative mx-auto max-w-[360px]">
              <div className="relative aspect-[486/640] overflow-hidden rounded-[var(--r-xl)] border border-border bg-surface-1">
                <Image
                  src="/saru.jpg"
                  alt="Utkarsh Kushwaha"
                  fill
                  sizes="(max-width: 1024px) 90vw, 360px"
                  className="object-cover"
                  priority
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--bg)]/70 via-transparent to-transparent" />
              </div>

              {/* floating tag pills */}
              <Pill className="-right-3 top-10" accent>
                Backend &amp; AI
              </Pill>
              <Pill className="-left-3 top-1/3">#utkarshwrks</Pill>
              <Pill className="-right-4 bottom-28">Full-Stack Dev</Pill>
              <Pill className="-left-2 bottom-12">DSA · 400+</Pill>
            </div>
          </motion.div>

          {/* ---------------- Middle: About me ---------------- */}
          <motion.div
            variants={reveal}
            custom={1}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-4"
          >
            <h2 className="text-3xl font-bold text-content sm:text-4xl">About me</h2>

            <p className="mt-5 text-2xl font-bold">
              <span className="text-gradient-animated">Hello, I&apos;m {hero.firstName ?? 'Utkarsh'} {hero.lastName ?? 'Kushwaha'}</span>
            </p>
            <p className="mt-1 text-sm text-muted">(Full-Stack &amp; AI Developer)</p>

            <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted sm:text-base">
              <p>{para1}</p>
              {para2 && <p>{para2}</p>}
            </div>

            {/* connect row */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              {hero.resumeHref && (
                <a
                  href={hero.resumeHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-[var(--r-pill)] bg-brand-500 px-4 py-2 text-sm font-semibold text-[var(--text-onbrand)] shadow-lg shadow-brand-500/25 transition-colors hover:bg-brand-400"
                >
                  <FileText className="h-4 w-4" /> Resume
                </a>
              )}
              {socials.github && <IconLink href={socials.github} label="GitHub"><SiGithub className="h-4 w-4" /></IconLink>}
              {socials.linkedin && <IconLink href={socials.linkedin} label="LinkedIn"><SiLinkedin className="h-4 w-4" /></IconLink>}
              {socials.email && (
                <IconLink href={`mailto:${socials.email}`} label="Email">
                  <Mail className="h-4 w-4" />
                </IconLink>
              )}
            </div>
          </motion.div>

          {/* ---------------- Right: Education ---------------- */}
          <motion.div
            variants={reveal}
            custom={2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="lg:col-span-3"
          >
            <h2 className="text-3xl font-bold text-content sm:text-4xl">Education</h2>

            <div className="mt-6 space-y-6">
              {education.map((e) => (
                <div key={`${e.title}-${e.org}`} className="border-l-2 border-brand-500/30 pl-4">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="font-semibold text-content">{e.title}</h3>
                    <span className="text-xs text-brand-300">({e.period})</span>
                  </div>
                  <p className="mt-1 text-sm leading-snug text-muted">{e.org}</p>
                  <span className="mt-2 inline-block rounded-[var(--r-pill)] border border-border bg-surface-2/60 px-2 py-0.5 text-xs text-subtle">
                    {e.meta}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* animated "a day in my life" scene fills the lower landscape area */}
        <LifeScene />
      </div>
    </section>
  )
}

function Pill({
  children,
  className = '',
  accent = false,
}: {
  children: React.ReactNode
  className?: string
  accent?: boolean
}) {
  return (
    <span
      className={`absolute z-10 whitespace-nowrap rounded-[var(--r-pill)] px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-sm ${
        accent
          ? 'border border-brand-500/40 bg-brand-500/15 text-brand-200'
          : 'border border-border bg-surface-2/90 text-content'
      } ${className}`}
    >
      {children}
    </span>
  )
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--r-pill)] border border-border bg-surface-1/60 text-muted transition-colors hover:border-brand-500/40 hover:text-content"
    >
      {children}
    </a>
  )
}
