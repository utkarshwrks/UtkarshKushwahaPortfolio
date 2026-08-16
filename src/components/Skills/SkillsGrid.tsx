'use client'
import CertificatesSection from '@/components/Certificate/Certificate'
import { motion } from 'framer-motion'
import {
  SiPython,
  SiJavascript,
  SiC,
  SiCplusplus,
  SiMysql,
  SiHtml5,
  SiCss3,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiDjango,
  SiFlask,
  SiFirebase,
  SiMongodb,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiPostman,
  SiVercel,
  SiLinux,
  SiDocker,
  SiTwilio,
  SiGo,
  SiGooglegemini,
  SiScikitlearn,
  SiPandas,
} from 'react-icons/si'
import { VscVscode, VscAzure } from 'react-icons/vsc'
import { FaCode } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import skillsJson from '@/data/skills.json'
import { siteCopy } from '@/lib/site-settings'

const EASE = [0.16, 1, 0.3, 1] as const

// Maps the JSON "icon" string (a Simple-Icons slug) -> an icon component.
// Unknown keys fall back to a generic code icon so nothing ever breaks.
const iconMap: Record<string, IconType> = {
  python: SiPython,
  javascript: SiJavascript,
  c: SiC,
  cplusplus: SiCplusplus,
  golang: SiGo,
  mysql: SiMysql,
  postgresql: SiPostgresql,
  html5: SiHtml5,
  css3: SiCss3,
  nextdotjs: SiNextdotjs,
  nodedotjs: SiNodedotjs,
  express: SiExpress,
  django: SiDjango,
  flask: SiFlask,
  firebase: SiFirebase,
  mongodb: SiMongodb,
  azure: VscAzure,
  git: SiGit,
  github: SiGithub,
  postman: SiPostman,
  vscode: VscVscode,
  vercel: SiVercel,
  linux: SiLinux,
  docker: SiDocker,
  twilio: SiTwilio,
  googlegemini: SiGooglegemini,
  scikitlearn: SiScikitlearn,
  pandas: SiPandas,
}

// Title (and display order) per category. Adding a new category here +
// tagging skills with it in skills.json is all it takes to surface a new group.
const CATEGORY_META: Record<string, { title: string }> = {
  programming: { title: 'Programming Languages' },
  web: { title: 'Web & Backend' },
  ai: { title: 'AI & GenAI' },
  database: { title: 'Databases & Cloud' },
  tools: { title: 'Tools & Platforms' },
}

type Skill = { name: string; icon: IconType }

// Build the category list straight from the data, preserving CATEGORY_META order
// and gracefully appending any category that isn't pre-registered.
const visibleSkills = skillsJson.filter((s: any) => !s.hidden)
const categoryOrder = Object.keys(CATEGORY_META)
const categories = Array.from(new Set(visibleSkills.map((s) => s.category)))
  .sort((a, b) => {
    const ia = categoryOrder.indexOf(a)
    const ib = categoryOrder.indexOf(b)
    return (ia === -1 ? Infinity : ia) - (ib === -1 ? Infinity : ib)
  })
  .map((key) => ({
    key,
    title: CATEGORY_META[key]?.title ?? key,
    items: visibleSkills
      .filter((s) => s.category === key)
      .map<Skill>((s) => ({ name: s.name, icon: iconMap[s.icon] ?? FaCode })),
  }))

function SkillTile({ item, index }: { item: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.025, 0.25), ease: EASE }}
      whileHover={{ y: -4 }}
      className="group flex aspect-square w-[88px] shrink-0 flex-col items-center justify-center gap-2 rounded-[var(--r-md)] border border-border bg-surface-2/50 p-2 transition-colors duration-300 hover:border-brand-500/40 hover:bg-surface-2"
    >
      <item.icon
        size={24}
        className="text-muted transition-colors duration-300 group-hover:text-brand-300"
      />
      <span className="px-1 text-center text-[0.7rem] leading-tight text-muted transition-colors duration-300 group-hover:text-content">
        {item.name}
      </span>
    </motion.div>
  )
}

// Designed bento cell width per category (on the 6-col desktop grid). Widths are
// woven (wide/narrow → narrow/wide → full) for a horizontal+vertical mix. The
// composition is fixed here, while skills inside each cell flow + center, so
// adding a skill fills the cell without ever changing the layout. Unknown
// categories fall back to a medium cell, so new groups still fit.
const SPAN: Record<string, string> = {
  programming: 'md:col-span-4',
  ai: 'md:col-span-2',
  web: 'md:col-span-2',
  database: 'md:col-span-4',
  tools: 'md:col-span-6',
}
const DEFAULT_SPAN = 'md:col-span-3'

function BentoCard({
  title,
  items,
  spanClass,
  delay = 0,
}: {
  title: string
  items: Skill[]
  spanClass: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className={`${spanClass} flex flex-col rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-brand-500/30`}
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="h-7 w-1 shrink-0 rounded-full bg-gradient-to-b from-brand-400 to-brand-600" />
        <h3 className="text-lg font-semibold text-content">{title}</h3>
        <span className="ml-auto rounded-[var(--r-pill)] border border-border bg-surface-2/60 px-2 py-0.5 text-xs text-muted">
          {items.length}
        </span>
      </div>

      {/* flex-wrap centered both axes: tiles wrap to new rows and stay centered
          with even gaps, and fill the card's height so nothing looks empty */}
      <div className="flex flex-1 flex-wrap content-center items-center justify-center gap-4">
        {items.map((item, i) => (
          <SkillTile key={item.name} item={item} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

export default function SkillsGrid() {
  return (
    <div className="py-20">
      <div className="mx-auto w-full max-w-[var(--container)] px-5 sm:px-8">
        {/* Heading */}
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400 [animation:pulse-glow_2s_ease-in-out_infinite]" />
            {siteCopy.skills.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
            className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
          >
            {siteCopy.skills.title}{siteCopy.skills.title ? ' ' : ''}
            <span className="text-gradient-animated">{siteCopy.skills.highlight}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
            className="max-w-xl text-base leading-relaxed text-muted"
          >
            {siteCopy.skills.subtitle}
          </motion.p>
        </div>

        {/* Bento grid — fixed woven composition; row-mates share height (items-stretch)
            and tiles center inside, so cells stay filled. Adding skills fills a cell,
            never reflows the layout. */}
        <div className="grid grid-cols-1 gap-5 [grid-auto-flow:dense] md:grid-cols-6">
          {categories.map((cat, i) => (
            <BentoCard
              key={cat.key}
              title={cat.title}
              items={cat.items}
              spanClass={SPAN[cat.key] ?? DEFAULT_SPAN}
              delay={Math.min(i * 0.06, 0.3)}
            />
          ))}
        </div>

        {/* Footer chip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-14 text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-[var(--r-pill)] border border-border bg-surface-1/60 px-6 py-3">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
            <span className="text-sm text-muted">Always learning new technologies</span>
          </div>
        </motion.div>
      </div>

      <CertificatesSection />
    </div>
  )
}
