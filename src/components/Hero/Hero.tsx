'use client'

import TypingText from './TypingText'
import CountUp from './CountUp'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import { FaFileAlt } from 'react-icons/fa'
import { ArrowDown } from 'lucide-react'
import Lottie from 'lottie-react'
import laptopCoffee1 from '@/lottie/Green.json'
import { Button } from '@/components/ui'
import { fadeUp, staggerContainer } from '@/components/ui/motion-presets'
import { defaultSettings } from '@/lib/site-settings'
import { projects } from '@/data/projects'

export default function Hero() {
  const { hero, socials } = defaultSettings

  // ---- Live credibility stats, derived from real project data ----------
  const stats = [
    { value: projects.length, suffix: '+', label: 'Projects shipped' },
    {
      value: projects.filter((p) => p.achievements?.length || p.award).length,
      suffix: '',
      label: 'Hackathon podiums',
    },
    {
      value: new Set(projects.flatMap((p) => p.tech)).size,
      suffix: '+',
      label: 'Technologies',
    },
  ]

  const socialLinks = [
    socials.github && { icon: <FaGithub />, href: socials.github, label: 'GitHub' },
    socials.linkedin && { icon: <FaLinkedin />, href: socials.linkedin, label: 'LinkedIn' },
    socials.email && { icon: <FaEnvelope />, href: `mailto:${socials.email}`, label: 'Email' },
  ].filter(Boolean) as { icon: React.ReactNode; href: string; label: string }[]

  return (
    <div className="relative flex min-h-screen items-center px-5 sm:px-8">
      <motion.div
        variants={staggerContainer(0.14, 0.1)}
        initial="hidden"
        animate="visible"
        className="mx-auto grid w-full max-w-[var(--container)] items-center gap-12 md:grid-cols-2"
      >
        {/* ---------- Left: copy ---------- */}
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          {/* Availability pill */}
          {hero.availableForWork && (
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
              </span>
              {hero.availabilityText}
            </motion.span>
          )}

          {/* Name */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-[1.1] sm:text-5xl md:text-6xl"
          >
            <span className="text-muted">{hero.greeting} </span>
            <span className="text-gradient-animated">{hero.firstName}</span>{' '}
            {hero.nickname && (
              <span className="block text-2xl font-mono text-brand-neon sm:text-3xl md:inline md:text-4xl">
                {hero.nickname}
              </span>
            )}{' '}
            <span className="text-content">{hero.lastName}</span>
          </motion.h1>

          {/* Typing line — terminal-style chip */}
          <motion.div
            variants={fadeUp}
            className="glass border-gradient inline-flex max-w-full items-center gap-3 rounded-[var(--r-md)] py-2 pl-3 pr-4 font-mono text-sm shadow-[var(--shadow-md)] sm:text-base"
          >
            <span className="flex shrink-0 items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            </span>
            <span className="h-4 w-px bg-border" />
            <span className="text-brand-400">~/</span>
            <TypingText className="text-content" phrases={hero.roles} />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {hero.description}
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
            <Button href={hero.primaryCtaHref} icon={<HiOutlineMail className="text-lg" />}>
              {hero.primaryCtaLabel}
            </Button>
            <Button href={hero.resumeHref} download variant="outline" icon={<FaFileAlt />}>
              Resume
            </Button>
          </motion.div>

          {/* Socials */}
          <motion.div variants={fadeUp} className="mt-2 flex gap-3">
            {socialLinks.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.92 }}
                className="glass flex h-11 w-11 items-center justify-center rounded-[var(--r-md)] text-xl text-muted transition-colors hover:text-brand-300"
              >
                {s.icon}
              </motion.a>
            ))}
          </motion.div>

          {/* Live stats — real numbers from project data */}
          <motion.div
            variants={fadeUp}
            className="mt-4 grid w-full max-w-md grid-cols-3 divide-x divide-border rounded-[var(--r-lg)] border border-border bg-surface-1/50 backdrop-blur-sm"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5 px-2 py-3 text-center">
                <span className="text-2xl font-bold text-content sm:text-3xl">
                  <span className="text-gradient">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </span>
                </span>
                <span className="text-[11px] leading-tight text-muted sm:text-xs">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ---------- Right: visual ---------- */}
        <motion.div variants={fadeUp} className="relative flex justify-center md:justify-end">
          <div className="relative">
            {/* glow ring behind the orb */}
            <div
              className="absolute inset-0 -z-10 rounded-full opacity-60 blur-3xl"
              style={{ background: 'radial-gradient(circle, var(--glow-brand), transparent 65%)' }}
            />

            {/* slow-rotating dashed orbit ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-8%] -z-[5] rounded-full border border-dashed border-brand-500/20"
            >
              <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 shadow-[0_0_12px_var(--glow-brand)]" />
            </motion.div>
            {/* counter-rotating inner ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[6%] -z-[5] rounded-full border border-brand-neon/10"
            >
              <span className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rounded-full bg-brand-neon shadow-[0_0_10px_var(--glow-neon)]" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="glass border-gradient flex h-72 w-72 items-center justify-center rounded-full p-6 sm:h-80 sm:w-80 lg:h-[26rem] lg:w-[26rem]"
            >
              <Lottie animationData={laptopCoffee1} loop className="h-full w-full" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* ---------- Scroll cue ---------- */}
      <motion.a
        href="#github"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted hover:text-brand-300"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-xs"
        >
          Scroll
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </div>
  )
}
