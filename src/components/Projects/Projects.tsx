'use client'

import { projects, type Project } from '@/data/projects'
import { siteCopy } from '@/lib/site-settings'
import { Github, ExternalLink, ArrowUpRight, Trophy, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

/* ------------------------------------------------------------------ */
/* Motion presets (kept local, tuned to match the site's --ease-out)  */
/* ------------------------------------------------------------------ */
const EASE = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const revealUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/* ------------------------------------------------------------------ */
/* Smart classification — content-driven, NOT position-driven.        */
/* A project becomes a large "showcase" card when it has imagery (or   */
/* is explicitly featured); everything else flows into the compact     */
/* grid. This means a newly-added project slots in automatically       */
/* without ever breaking the layout.                                   */
/* ------------------------------------------------------------------ */
function hasImages(p: Project) {
  return Array.isArray(p.images) && p.images.length > 0
}

/** Explicit `featured` toggle wins; otherwise a project with images is featured. */
function isFeatured(p: Project) {
  return typeof p.featured === 'boolean' ? p.featured : hasImages(p)
}

/* ------------------------------------------------------------------ */
/* Award badge — renders ONLY when an award string is present.        */
/* ------------------------------------------------------------------ */
function AwardBadge({ award, floating = false }: { award: string; floating?: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-3 py-1 text-xs font-semibold',
        'border border-amber-400/30 bg-amber-400/10 text-amber-200',
        'shadow-[0_4px_24px_-8px_rgba(251,191,36,0.5)] backdrop-blur-md',
        floating ? 'absolute left-3 top-3 z-10' : '',
      ].join(' ')}
    >
      <Trophy className="h-3.5 w-3.5 text-amber-300" />
      {award}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Image carousel with crossfade + counter (graceful for 1..n images) */
/* ------------------------------------------------------------------ */
function ProjectGallery({ project }: { project: Project }) {
  const images = project.images ?? []
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(0)
  const count = images.length

  const go = (delta: number) => {
    setDir(delta)
    setIndex((i) => (i + delta + count) % count)
  }

  return (
    <div className="group/gallery relative aspect-[16/10] w-full overflow-hidden bg-surface-2">
      <AnimatePresence initial={false} custom={dir} mode="popLayout">
        <motion.div
          key={index}
          custom={dir}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={`${project.name} — screenshot ${index + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {/* readability gradient at the bottom */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-black/60 group-hover/gallery:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white opacity-0 backdrop-blur-md transition-all duration-300 hover:bg-black/60 group-hover/gallery:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* counter pill */}
          <div className="absolute right-3 top-3 z-10 rounded-[var(--r-pill)] border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
            {index + 1} / {count}
          </div>

          {/* dot indicators */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDir(i > index ? 1 : -1)
                  setIndex(i)
                }}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-5 bg-brand-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function TechTags({ tech, dense = false }: { tech: string[]; dense?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <span
          key={t}
          className={`rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 text-brand-300 ${
            dense ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs'
          } font-medium`}
        >
          {t}
        </span>
      ))}
    </div>
  )
}

function ProjectLinks({ project, compact = false }: { project: Project; compact?: boolean }) {
  const hasGithub = project.github && project.github !== '#'
  const hasLive = project.live && project.live !== '#'
  if (!hasGithub && !hasLive) return null

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {hasGithub && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} source on GitHub`}
            className="rounded-[var(--r-md)] p-2 text-muted transition-colors hover:bg-surface-2 hover:text-brand-300"
          >
            <Github className="h-[18px] w-[18px]" />
          </a>
        )}
        {hasLive && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} live demo`}
            className="rounded-[var(--r-md)] p-2 text-muted transition-colors hover:bg-surface-2 hover:text-brand-300"
          >
            <ExternalLink className="h-[18px] w-[18px]" />
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {hasGithub && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[var(--r-md)] border border-border bg-surface-2 px-4 py-2 text-sm font-medium text-content transition-all duration-300 hover:border-brand-500/40 hover:bg-surface-3"
        >
          <Github className="h-[18px] w-[18px]" /> Code
        </a>
      )}
      {hasLive && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-[var(--r-md)] bg-brand-500 px-4 py-2 text-sm font-semibold text-[var(--text-onbrand)] transition-all duration-300 hover:bg-brand-400 hover:shadow-[0_8px_30px_-8px_var(--glow-brand)]"
        >
          <ExternalLink className="h-[18px] w-[18px]" /> Live Demo
        </a>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Browser-frame wrapper (B) — a minimal window chrome around a shot   */
/* ------------------------------------------------------------------ */
function frameUrl(project: Project): string {
  const raw =
    project.live && project.live !== '#'
      ? project.live
      : project.github && project.github !== '#'
        ? project.github
        : ''
  if (!raw) return `~/${project.slug}`
  try {
    const u = new URL(raw)
    const host = u.hostname.replace(/^www\./, '')
    const path = u.pathname !== '/' ? u.pathname : ''
    return host + path
  } catch {
    return `~/${project.slug}`
  }
}

function BrowserFrame({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[var(--r-lg)] border border-border bg-surface-2">
      <div className="flex items-center gap-2 border-b border-border bg-surface-3/40 px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
        </div>
        <div className="ml-1 flex-1 truncate rounded-[var(--r-pill)] border border-border bg-surface-1 px-3 py-1 font-mono text-[11px] text-subtle">
          {url}
        </div>
      </div>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Metadata strip (C) — a quiet definition list, rows render on demand */
/* ------------------------------------------------------------------ */
function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <dt className="font-mono text-[11px] uppercase tracking-wider text-subtle">{label}</dt>
      <dd className="text-sm text-muted">{children}</dd>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Showcase card (A + B + C) — numbered case study, browser frame,     */
/* structured metadata. Keeps the alternating zig-zag layout.          */
/* ------------------------------------------------------------------ */
function ShowcaseCard({ project, index }: { project: Project; index: number }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const reverse = index % 2 === 1
  const num = String(index + 1).padStart(2, '0')
  const recognition =
    project.award || (project.achievements?.length ? project.achievements.join(' · ') : '')
  const status = (project.status || '').toLowerCase()
  const showImage = hasImages(project)

  return (
    <motion.article
      ref={ref}
      variants={revealUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={`group grid grid-cols-1 items-center gap-6 rounded-[var(--r-xl)] border border-border bg-surface-1/50 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-brand-500/30 sm:p-6 lg:gap-10 lg:p-8 ${
        showImage ? 'lg:grid-cols-2' : ''
      }`}
    >
      {/* Browser-framed screenshot */}
      {showImage && (
        <div className={reverse ? 'lg:order-2' : ''}>
          <BrowserFrame url={frameUrl(project)}>
            <ProjectGallery project={project} />
          </BrowserFrame>
        </div>
      )}

      {/* Case-study content */}
      <div className="flex flex-col gap-4">
        {/* A — index + label */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm font-semibold text-brand-300">{num}</span>
          <span className="h-px w-8 bg-border" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-subtle">Featured Project</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-2xl font-bold text-content sm:text-3xl">{project.name}</h3>
          <p className="leading-relaxed text-muted">{project.description}</p>
        </div>

        {/* C — metadata */}
        <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5">
          {project.role && <MetaRow label="Role">{project.role}</MetaRow>}
          <MetaRow label="Stack">{project.tech.join('  ·  ')}</MetaRow>
          {project.year && <MetaRow label="Year">{project.year}</MetaRow>}
          {status && (
            <MetaRow label="Status">
              <span className="inline-flex items-center gap-1.5 capitalize">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    status === 'live' ? 'bg-brand-400' : 'bg-subtle'
                  }`}
                />
                {status}
              </span>
            </MetaRow>
          )}
          {recognition && (
            <MetaRow label="Award">
              <span className="inline-flex items-center gap-1.5 text-amber-200/90">
                <Trophy className="h-3.5 w-3.5 text-amber-300" />
                {recognition}
              </span>
            </MetaRow>
          )}
        </dl>

        <ProjectLinks project={project} />
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* Compact card (no imagery)                                          */
/* ------------------------------------------------------------------ */
function CompactCard({ project }: { project: Project }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <motion.article
      ref={ref}
      variants={revealUp}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
      className="group flex h-full flex-col gap-3 rounded-[var(--r-lg)] border border-border bg-surface-1/60 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-brand-500/30"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold text-content transition-colors group-hover:text-brand-300">
          {project.name}
        </h4>
        <ProjectLinks project={project} compact />
      </div>

      {project.award && <AwardBadge award={project.award} />}

      <p className="flex-1 text-sm leading-relaxed text-muted">{project.description}</p>

      <TechTags tech={project.tech} dense />
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */
export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const showcase = projects.filter(isFeatured)
  const compact = projects.filter((p) => !isFeatured(p))

  return (
    <div className="relative mx-auto w-full max-w-[var(--container)] px-5 py-16 sm:px-8">
      {/* Heading */}
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="mb-14 flex flex-col items-center gap-3 text-center"
      >
        <motion.span
          variants={revealUp}
          className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 [animation:pulse-glow_2s_ease-in-out_infinite]" />
          {siteCopy.projects.eyebrow}
        </motion.span>
        <motion.h2 variants={revealUp} className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {siteCopy.projects.title}{siteCopy.projects.title ? ' ' : ''}
          <span className="text-gradient-animated">{siteCopy.projects.highlight}</span>
        </motion.h2>
        <motion.p variants={revealUp} className="max-w-xl text-base leading-relaxed text-muted">
          {siteCopy.projects.subtitle}
        </motion.p>
      </motion.div>

      {/* Showcase */}
      {showcase.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          className="flex flex-col gap-8 lg:gap-12"
        >
          {showcase.map((project, index) => (
            <ShowcaseCard key={project.slug} project={project} index={index} />
          ))}
        </motion.div>
      )}

      {/* Compact grid */}
      {compact.length > 0 && (
        <div className="mt-16">
          <motion.h3
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-7 text-center text-xl font-semibold text-content"
          >
            More Projects
          </motion.h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {compact.map((project) => (
              <CompactCard key={project.slug} project={project} />
            ))}
          </motion.div>
        </div>
      )}

      {/* View more */}
      <div className="mt-14 text-center">
        <a
          href="https://github.com/utkarshwrks"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/40 bg-brand-500/10 px-7 py-3 text-sm font-semibold text-brand-300 transition-all duration-300 hover:bg-brand-500/15 hover:shadow-[0_0_28px_-6px_var(--glow-brand)]"
        >
          <Github className="h-5 w-5" />
          View more on GitHub
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </div>
  )
}
