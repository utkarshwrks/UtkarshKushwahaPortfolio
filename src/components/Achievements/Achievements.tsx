'use client'

import { Calendar, MapPin, Award, Code2, ExternalLink, ChevronLeft, ChevronRight, Trophy, type LucideIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Leadership from '@/components/Leaderboard/Leaderboard'
import achievementsData from '@/data/achievements.json'
import { siteCopy } from '@/lib/site-settings'

type Achievement = {
  title: string
  badge: string
  rank: string
  rankType: string
  year: string
  location: string
  project: string
  desc: string
  prize: string
  tech: string[]
  gradient: string
  liveLink: string
  codeLink: string
  category?: string
  images?: string[]
}

const DEFAULT_CATEGORY = 'Hackathons & Awards'

// Auto-rotating visual for the right-hand card. Shows uploaded images (cycling
// through them if there is more than one) or falls back to the award icon.
function AchievementVisual({ achievement }: { achievement: Achievement }) {
  const images = (achievement.images ?? []).filter(Boolean)
  const [imgIndex, setImgIndex] = useState(0)

  // Restart from the first image whenever the achievement changes.
  useEffect(() => {
    setImgIndex(0)
  }, [achievement])

  // Cycle through the images when there is more than one.
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(id)
  }, [images.length, achievement])

  return (
    <div className="relative h-64 w-full max-w-md sm:h-80">
      <motion.div
        animate={{ rotate: [0, 5, 0, -5, 0], scale: [1, 1.02, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} rotate-6 rounded-3xl shadow-2xl`}
      />
      <motion.div
        animate={{ rotate: [0, -3, 0, 3, 0], scale: [1, 1.01, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute inset-2 flex -rotate-3 items-center justify-center overflow-hidden rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-2xl"
      >
        {images.length > 0 ? (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={images[imgIndex]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                {/* Blurred fill so nothing looks empty behind the fitted image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[imgIndex]}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-xl"
                />
                {/* The full image, never cropped */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={images[imgIndex]}
                  alt={achievement.project || achievement.title || 'Achievement image'}
                  className="absolute inset-0 h-full w-full object-contain p-1.5"
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-center">
              <h4 className="mb-0.5 text-base font-bold text-white sm:text-lg">
                {achievement.project}
              </h4>
              <p className="text-xs text-zinc-300 sm:text-sm">{achievement.year}</p>
              <div className="mt-2 flex justify-center gap-4">
                {achievement.codeLink && achievement.codeLink !== '#' && (
                  <a
                    href={achievement.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 transition-colors hover:text-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Code2 className="h-5 w-5" />
                  </a>
                )}
                {achievement.liveLink && achievement.liveLink !== '#' && (
                  <a
                    href={achievement.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 transition-colors hover:text-green-400"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
            {images.length > 1 && (
              <div className="absolute right-3 top-3 flex gap-1.5">
                {images.map((img, i) => (
                  <span
                    key={img}
                    className={`h-1.5 rounded-full transition-all ${
                      i === imgIndex ? 'w-4 bg-brand-400' : 'w-1.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <Award className="mx-auto mb-4 h-16 w-16 text-brand-400 sm:h-20 sm:w-20" />
            <h4 className="mb-2 text-lg font-bold text-white sm:text-xl">
              {achievement.project}
            </h4>
            <p className="text-sm text-zinc-400">{achievement.year}</p>
            <div className="mt-4 flex justify-center gap-4">
              <a
                href={achievement.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <Code2 className="h-5 w-5" />
              </a>
              <a
                href={achievement.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 transition-colors hover:text-green-400"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

type SectionHeader = {
  eyebrow: string
  title: string
  highlight: string
  subtitle: string
  icon: LucideIcon
}

// A single self-contained achievement carousel (header + slides + dots + preview grid).
function AchievementCarousel({ items, header }: { items: Achievement[]; header: SectionHeader }) {
  const Icon = header.icon
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % items.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, items.length])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isMobile ? 100 : 300) : (isMobile ? -100 : -300),
      opacity: 0,
      scale: 0.9,
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? (isMobile ? 100 : 300) : (isMobile ? -100 : -300),
      opacity: 0,
      scale: 0.9,
    }),
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleLinkClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const current = items[currentIndex]

  return (
    <div
      className="mb-16 sm:mb-20"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col items-center gap-3 text-center sm:mb-16"
      >
        <span className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
          <Icon className="h-3.5 w-3.5" />
          {header.eyebrow}
        </span>
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {header.title}{header.title ? ' ' : ''}
          <span className="text-gradient-animated">{header.highlight}</span>
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
          {header.subtitle}
        </p>
      </motion.div>

      {/* Carousel */}
      <div className="relative mb-12 sm:mb-16">
        {items.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute -left-2 sm:-left-4 md:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-surface-2/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface-3 transition-all duration-300 hover:scale-110 border border-border z-20 shadow-lg"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute -right-2 sm:-right-4 md:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-surface-2/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-surface-3 transition-all duration-300 hover:scale-110 border border-border z-20 shadow-lg"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        <div className="relative h-auto min-h-[600px] sm:min-h-[500px] mx-2 sm:mx-8 md:mx-0">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.4 },
              }}
              className="absolute inset-0"
            >
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 h-full">
                {/* Left Side - Content */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col justify-center space-y-4 sm:space-y-6 p-4 sm:p-6 bg-surface-1/60 backdrop-blur-sm rounded-2xl border border-border shadow-2xl"
                >
                  <motion.div variants={itemVariants} className="flex items-center gap-4 mb-2 sm:mb-4">
                    <span className="text-3xl sm:text-4xl">{current.badge}</span>
                    <span
                      className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                        current.rankType === 'success'
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                          : current.rankType === 'warning'
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25'
                          : 'bg-gradient-to-r from-gray-500 to-zinc-500 text-white shadow-lg shadow-gray-500/25'
                      }`}
                    >
                      {current.rank}
                    </span>
                  </motion.div>

                  <motion.h3
                    variants={itemVariants}
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight"
                  >
                    {current.title}
                  </motion.h3>

                  <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center gap-3 sm:gap-4 text-zinc-300 text-sm sm:text-base"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{current.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="max-w-[150px] sm:max-w-none truncate">{current.location}</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
                    <p className="text-base sm:text-lg">
                      <strong className={`bg-gradient-to-r ${current.gradient} bg-clip-text text-transparent`}>
                        Project:
                      </strong>{' '}
                      {current.project}
                    </p>
                    <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                      {current.desc}
                    </p>
                  </motion.div>

                  <motion.p
                    variants={itemVariants}
                    className="text-lg sm:text-xl font-semibold text-brand-300"
                  >
                    <strong>Prize:</strong> {current.prize}
                  </motion.p>

                  <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
                    {current.tech.map((tech, index) => (
                      <motion.span
                        key={tech}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-surface-2 rounded-lg text-xs sm:text-sm text-muted border border-border hover:border-brand-400 transition-all duration-300 hover:scale-105"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-4">
                    <button
                      onClick={(e) => handleLinkClick(e, current.codeLink)}
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all duration-300 hover:scale-105 border border-zinc-700 text-sm sm:text-base"
                    >
                      <Code2 className="w-4 h-4" />
                      View Code
                    </button>
                    <button
                      onClick={(e) => handleLinkClick(e, current.liveLink)}
                      className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-[var(--text-onbrand)] shadow-lg shadow-brand-500/25 transition-all duration-300 hover:scale-105 hover:bg-brand-400 sm:px-6 sm:py-3 sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </button>
                  </motion.div>
                </motion.div>

                {/* Right Side - Visual */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="hidden lg:flex items-center justify-center p-8"
                >
                  <AchievementVisual achievement={current} />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Dots */}
      {items.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-brand-400 scale-125 shadow-lg shadow-brand-400/50'
                  : 'bg-surface-3 hover:bg-muted'
              }`}
            />
          ))}
        </motion.div>
      )}

      {/* Preview Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      >
        {items.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => goToSlide(index)}
            className={`p-3 sm:p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm ${
              index === currentIndex
                ? 'border-brand-400 bg-brand-500/10 shadow-lg shadow-brand-400/20'
                : 'border-border bg-surface-1/60 hover:border-surface-3'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{achievement.badge}</span>
              <span className="text-xs text-zinc-400">{achievement.year}</span>
            </div>
            <h4 className="font-semibold text-xs sm:text-sm line-clamp-2 mb-2 leading-tight">
              {achievement.project}
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-xs text-zinc-400">{achievement.rank}</span>
              <motion.div
                animate={index === currentIndex ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 2, repeat: index === currentIndex ? Infinity : 0 }}
                className={`w-2 h-2 rounded-full ${index === currentIndex ? 'bg-brand-400' : 'bg-surface-3'}`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function Achievements() {
  const achievements = achievementsData as unknown as Achievement[]

  const SECTIONS: (SectionHeader & { category: string })[] = [
    {
      category: DEFAULT_CATEGORY,
      eyebrow: siteCopy.achievements.eyebrow,
      title: siteCopy.achievements.title,
      highlight: siteCopy.achievements.highlight,
      subtitle: siteCopy.achievements.subtitle,
      icon: Trophy,
    },
    {
      category: 'Competitive Programming',
      eyebrow: 'Competitive Programming',
      title: 'Code',
      highlight: 'Arena',
      subtitle: 'Contest rankings, problem-solving milestones, and competitive coding wins.',
      icon: Code2,
    },
  ]

  const groups = SECTIONS.map((section) => ({
    header: section,
    items: achievements.filter((a) => (a.category || DEFAULT_CATEGORY) === section.category),
  })).filter((group) => group.items.length > 0)

  return (
    <section className="relative overflow-hidden px-4 py-8 text-content sm:px-6 sm:py-12">
      <div className="relative z-10 mx-auto max-w-6xl">
        {groups.map((group) => (
          <AchievementCarousel key={group.header.category} items={group.items} header={group.header} />
        ))}


        {/* Leadership Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-8 sm:pt-12"
        >
          <Leadership />
        </motion.div>
      </div>
    </section>
  )
}
