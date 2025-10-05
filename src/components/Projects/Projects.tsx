'use client'

import { projects } from '@/data/projects'
import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Animation variants - FIXED VERSION
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.6
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
      duration: 0.7
    }
  }
}

const slideInUp = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
      duration: 0.6
    }
  }
}

const fadeIn = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
}

// Animated Project Card Component
function AnimatedProjectCard({ project, index, isShowcase = false }: { project: any; index: number; isShowcase?: boolean }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [imageIndex, setImageIndex] = useState(0)

  const prev = () => {
    const length = project.images?.length || 1
    setImageIndex((prev) => (prev - 1 + length) % length)
  }

  const next = () => {
    const length = project.images?.length || 1
    setImageIndex((prev) => (prev + 1) % length)
  }

  if (isShowcase) {
    const reverse = index % 2 === 1
    return (
      <motion.div
        ref={ref}
        variants={itemVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className={`w-full rounded-2xl shadow-lg border border-gray-700 p-6 flex flex-col lg:flex-row gap-6 bg-gray-900/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:border-green-500/50 ${
          reverse ? 'lg:flex-row-reverse' : ''
        }`}
        whileHover={{ 
          y: -8,
          transition: { type: "spring" as const, stiffness: 400, damping: 15 }
        }}
      >
        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <motion.div 
            className="relative w-full lg:w-1/2 overflow-hidden rounded-xl flex-shrink-0"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring" as const, stiffness: 300 }}
          >
            <Image
              src={project.images[imageIndex]}
              alt={project.name}
              width={800}
              height={400}
              className="w-full h-64 lg:h-80 object-cover rounded-xl"
            />
            
            {/* Image Navigation */}
            {project.images.length > 1 && (
              <>
                <motion.button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &#8592;
                </motion.button>
                <motion.button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  &#8594;
                </motion.button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_: any, idx: number) => (
                    <motion.div
                      key={idx}
                      className={`w-2 h-2 rounded-full ${
                        idx === imageIndex ? 'bg-green-400' : 'bg-gray-400'
                      }`}
                      whileHover={{ scale: 1.3 }}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          <motion.h3 
            className="text-2xl font-bold text-green-400"
            whileHover={{ x: 5 }}
          >
            {project.name}
          </motion.h3>
          
          <motion.p 
            className="text-gray-300"
            variants={fadeIn}
          >
            {project.description}
          </motion.p>

          {project.achievements && project.achievements.length > 0 && (
            <motion.ul 
              className="space-y-2"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {project.achievements.map((achievement: string, idx: number) => (
                <motion.li
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  className="text-yellow-400 text-sm flex items-start"
                >
                  <span className="text-green-400 mr-2">•</span>
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </motion.ul>
          )}

          {/* Tech Stack */}
          <motion.div 
            className="flex flex-wrap gap-2 mt-2"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {project.tech.map((tech: string) => (
              <motion.span
                key={tech}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="text-xs px-3 py-1 rounded-full border border-green-500/50 text-green-300 bg-green-500/10 backdrop-blur-sm"
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: "rgba(34, 197, 94, 0.2)"
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div 
            className="flex gap-4 mt-4"
            variants={fadeIn}
          >
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-green-500 transition-all duration-300 text-white group"
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ rotate: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Github size={18} />
                </motion.span>
                GitHub
              </motion.a>
            )}
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-green-500 transition-all duration-300 text-white group"
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ExternalLink size={18} />
                </motion.span>
                Live Demo
              </motion.a>
            )}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // Other Projects (Grid Items)
  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="p-6 rounded-xl border border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-300 bg-gray-900/50 backdrop-blur-sm hover:border-green-500/50 flex flex-col justify-between"
      whileHover={{ 
        y: -6,
        transition: { type: "spring" as const, stiffness: 400, damping: 15 }
      }}
    >
      <div className="flex flex-col flex-1 gap-3">
        <motion.h4 
          className="font-bold text-green-400"
          whileHover={{ x: 3 }}
        >
          {project.name}
        </motion.h4>
        
        <motion.p 
          className="text-gray-300 text-sm"
          variants={fadeIn}
        >
          {project.description}
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-2 mt-2"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.03,
                delayChildren: 0.2
              }
            }
          }}
        >
          {project.tech.map((tech: string) => (
            <motion.span
              key={tech}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1 }
              }}
              className="text-xs px-2 py-1 rounded-full border border-green-500/50 text-green-300 bg-green-500/10"
              whileHover={{ scale: 1.05 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <motion.div 
        className="flex gap-3 mt-4 justify-end"
        variants={fadeIn}
      >
        {project.github && (
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-green-400 p-2 rounded-lg hover:bg-green-500/10 transition-colors"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Github size={18} />
          </motion.a>
        )}
        {project.live && (
          <motion.a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-400 hover:text-green-400 p-2 rounded-lg hover:bg-green-500/10 transition-colors"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
          >
            <ExternalLink size={18} />
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const showcase = projects.slice(0, 3)
  const others = projects.slice(3)

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="space-y-16 px-4 md:px-8 lg:px-16 py-16"
    >
      {/* Background Gradients */}
      <motion.div
        className="absolute left-0 w-72 h-72 bg-green-400/10 rounded-full blur-3xl -z-10"
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ 
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut" as const
        }}
      />
      
      <motion.div
        className="absolute right-0 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl -z-10"
        animate={{ 
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut" as const
        }}
      />

      {/* Heading */}
      <motion.div
        variants={slideInUp}
        className="text-center"
      >
        <motion.h2 
          className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4"
          whileHover={{ scale: 1.02 }}
        >
          Projects
        </motion.h2>
        
        <motion.div 
          className="w-20 h-1 bg-gradient-to-r from-green-400 to-cyan-400 mx-auto my-3 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: 80 } : { width: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
        
        <motion.p 
          variants={fadeIn}
          className="mt-4 text-gray-400 max-w-xl mx-auto italic"
          whileHover={{ scale: 1.02 }}
        >
          Things I've Built (and Broken, Then Fixed)
        </motion.p>
      </motion.div>

      {/* TOP 3 PROJECTS WITH IMAGES */}
      <motion.div 
        variants={containerVariants}
        className="flex flex-col gap-16"
      >
        {showcase.map((project, index) => (
          <AnimatedProjectCard 
            key={project.slug} 
            project={project} 
            index={index} 
            isShowcase={true} 
          />
        ))}
      </motion.div>

      {/* OTHER PROJECTS WITHOUT IMAGES */}
      {others.length > 0 && (
        <motion.div
          variants={slideInUp}
        >
          <motion.h3 
            className="text-2xl font-semibold text-white mb-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            Other Projects
          </motion.h3>
          
          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {others.map((project, index) => (
              <AnimatedProjectCard 
                key={project.slug} 
                project={project} 
                index={index} 
                isShowcase={false} 
              />
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* VIEW MORE BUTTON */}
      <motion.div 
        className="text-center mt-8"
        variants={fadeIn}
      >
        <motion.a
          href="https://github.com/utkarshwrks"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-3 text-green-400 font-semibold rounded-lg border border-green-500/50 bg-green-500/10 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-300 group"
          whileHover={{ 
            scale: 1.05,
            backgroundColor: "rgba(34, 197, 94, 0.15)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            animate={{ rotate: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Github size={20} />
          </motion.span>
          View More Projects
          <motion.span
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ↗
          </motion.span>
        </motion.a>
      </motion.div>
    </motion.div>
  )
}