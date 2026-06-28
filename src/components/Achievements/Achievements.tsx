'use client'

import { Calendar, MapPin, Award, Code2, ExternalLink, ChevronLeft, ChevronRight, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Leadership from '@/components/Leaderboard/Leaderboard'
import achievementsData from '@/data/achievements.json'
import { siteCopy } from '@/lib/site-settings'

export default function Achievements() {
  const achievements = achievementsData

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const nextSlide = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % achievements.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + achievements.length) % achievements.length)
  }

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, currentIndex])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? (isMobile ? 100 : 300) : (isMobile ? -100 : -300),
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? (isMobile ? 100 : 300) : (isMobile ? -100 : -300),
      opacity: 0,
      scale: 0.9,
    }),
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  // Handle link clicks
  const handleLiveLinkClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleCodeLinkClick = (e: React.MouseEvent, link: string) => {
    e.stopPropagation()
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      className="relative overflow-hidden px-4 py-8 text-content sm:px-6 sm:py-12"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col items-center gap-3 text-center sm:mb-16"
        >
          <span className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
            <Trophy className="h-3.5 w-3.5" />
            {siteCopy.achievements.eyebrow}
          </span>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {siteCopy.achievements.title}{siteCopy.achievements.title ? ' ' : ''}
            <span className="text-gradient-animated">{siteCopy.achievements.highlight}</span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            {siteCopy.achievements.subtitle}
          </p>
        </motion.div>

        {/* Main Carousel Container */}
        <div className="relative mb-12 sm:mb-16">
          {/* Navigation Arrows */}
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

          {/* Carousel Content */}
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
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.4 }
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
                      <span className="text-3xl sm:text-4xl">{achievements[currentIndex].badge}</span>
                      <span
                        className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${
                          achievements[currentIndex].rankType === 'success'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                            : achievements[currentIndex].rankType === 'warning'
                            ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25'
                            : 'bg-gradient-to-r from-gray-500 to-zinc-500 text-white shadow-lg shadow-gray-500/25'
                        }`}
                      >
                        {achievements[currentIndex].rank}
                      </span>
                    </motion.div>

                    <motion.h3
                      variants={itemVariants}
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight"
                    >
                      {achievements[currentIndex].title}
                    </motion.h3>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap items-center gap-3 sm:gap-4 text-zinc-300 text-sm sm:text-base"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{achievements[currentIndex].year}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span className="max-w-[150px] sm:max-w-none truncate">{achievements[currentIndex].location}</span>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-3 sm:space-y-4">
                      <p className="text-base sm:text-lg">
                        <strong className={`bg-gradient-to-r ${achievements[currentIndex].gradient} bg-clip-text text-transparent`}>
                          Project:
                        </strong>{' '}
                        {achievements[currentIndex].project}
                      </p>
                      <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                        {achievements[currentIndex].desc}
                      </p>
                    </motion.div>

                    <motion.p
                      variants={itemVariants}
                      className="text-lg sm:text-xl font-semibold text-brand-300"
                    >
                      <strong>Prize:</strong> {achievements[currentIndex].prize}
                    </motion.p>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap gap-2"
                    >
                      {achievements[currentIndex].tech.map((tech, index) => (
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

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-wrap gap-3 pt-4"
                    >
                      <button
                        onClick={(e) => handleCodeLinkClick(e, achievements[currentIndex].codeLink)}
                        className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all duration-300 hover:scale-105 border border-zinc-700 text-sm sm:text-base"
                      >
                        <Code2 className="w-4 h-4" />
                        View Code
                      </button>
                      <button
                        onClick={(e) => handleLiveLinkClick(e, achievements[currentIndex].liveLink)}
                        className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-[var(--text-onbrand)] shadow-lg shadow-brand-500/25 transition-all duration-300 hover:scale-105 hover:bg-brand-400 sm:px-6 sm:py-3 sm:text-base"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </button>
                    </motion.div>
                  </motion.div>

                  {/* Right Side - Visual Element */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="hidden lg:flex items-center justify-center p-8"
                  >
                    <div className="relative w-full max-w-md h-64 sm:h-80">
                      <motion.div
                        animate={{
                          rotate: [0, 5, 0, -5, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute inset-0 bg-gradient-to-br ${achievements[currentIndex].gradient} rounded-3xl rotate-6 shadow-2xl`}
                      />
                      <motion.div
                        animate={{
                          rotate: [0, -3, 0, 3, 0],
                          scale: [1, 1.01, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                        className="absolute inset-2 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl -rotate-3 flex items-center justify-center shadow-2xl border border-zinc-700"
                      >
                        <div className="text-center">
                          <Award className="w-16 h-16 sm:w-20 sm:h-20 text-brand-400 mb-4 mx-auto" />
                          <h4 className="text-white font-bold text-lg sm:text-xl mb-2">
                            {achievements[currentIndex].project}
                          </h4>
                          <p className="text-zinc-400 text-sm">
                            {achievements[currentIndex].year}
                          </p>
                          <div className="flex justify-center gap-4 mt-4">
                            <a
                              href={achievements[currentIndex].codeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Code2 className="w-5 h-5" />
                            </a>
                            <a
                              href={achievements[currentIndex].liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-green-400 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-5 h-5" />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 sm:gap-3 mb-8 sm:mb-12"
        >
          {achievements.map((_, index) => (
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

        {/* Preview Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16"
        >
          {achievements.map((achievement, index) => (
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
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-brand-400' : 'bg-surface-3'
                  }`}
                />
              </div>
              {/* Quick action links on preview cards */}
              <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <a
                  href={achievement.codeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Code2 className="w-3 h-3" />
                </a>
                <a
                  href={achievement.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-green-400 transition-colors text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </motion.div>

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
