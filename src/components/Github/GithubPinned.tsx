'use client'
import { useEffect, useState } from 'react'
import { FaCodeBranch, FaAward, FaLaptopCode, FaTools, FaFolderOpen } from 'react-icons/fa'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.8
    }
  }
}

const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -80,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 1
    }
  }
}

const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 80,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 15,
      duration: 1
    }
  }
}

// Animated components
function AnimatedStats({ stats }: { stats: typeof stats }) {
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false to trigger every time
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="flex flex-wrap justify-around items-center mb-24 max-w-6xl mx-auto gap-8"
    >
      {stats.map((s, i) => (
        <motion.div
          key={i}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.1,
            y: -8,
            transition: { type: "spring", stiffness: 300 }
          }}
          className="flex-1 flex flex-col items-center text-center min-w-[140px] cursor-pointer"
        >
          <motion.div 
            className="text-3xl text-[#22ff99] mb-2"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {s.icon}
          </motion.div>
          <motion.div 
            className="text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            {s.value}
          </motion.div>
          <div className="text-gray-500 text-sm">{s.label}</div>
        </motion.div>
      ))}
    </motion.div>
  )
}

function AnimatedContentSection() {
  const [leftRef, leftInView] = useInView({
    triggerOnce: false, // Changed to false to trigger every time
    threshold: 0.2,
  })

  const [rightRef, rightInView] = useInView({
    triggerOnce: false, // Changed to false to trigger every time
    threshold: 0.2,
  })

  const funFacts = [
    { icon: '☕', label: 'Fueled by Chai & Curiosity' },
    { icon: '🎧', label: 'Music Played While Coding' },
    { icon: '🌙', label: 'Night Owl: Best Code After Midnight' },
  ]

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto mb-24 md:justify-between gap-12">
      {/* Left: Who Am I */}
      <motion.div
        ref={leftRef}
        variants={slideInLeft}
        initial="hidden"
        animate={leftInView ? "visible" : "hidden"}
        className="md:w-1/2 text-center md:text-left"
      >
        <motion.h3 
          className="text-2xl font-semibold mb-6 text-[#22ff99]"
          whileHover={{ scale: 1.05 }}
        >
          Who Am I?
        </motion.h3>
        <motion.p 
          className="leading-relaxed text-lg text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0 }}
          animate={leftInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.4 }}
        >
          Hi! I'm Utkarsh, a full-stack developer passionate about building scalable applications
          and integrating AI/ML to solve real-world problems. I thrive on exploring modern tech stacks,
          optimizing performance, and delivering impactful solutions.{" "}
          <motion.a 
            href="/about" 
            className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 font-medium transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            know more...
          </motion.a>
        </motion.p>
      </motion.div>

      {/* Right: Fun Facts */}
      <motion.div
        ref={rightRef}
        variants={slideInRight}
        initial="hidden"
        animate={rightInView ? "visible" : "hidden"}
        className="md:w-1/3 flex flex-col items-center md:items-start gap-8"
      >
        {funFacts.map((fact, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ 
              x: 10,
              transition: { type: "spring", stiffness: 400 }
            }}
            className="flex items-center gap-4 cursor-pointer"
          >
            <motion.div 
              className="text-3xl"
              whileHover={{ scale: 1.3, rotate: 10 }}
            >
              {fact.icon}
            </motion.div>
            <motion.div 
              className="text-gray-100 font-medium"
              initial={{ opacity: 0 }}
              animate={rightInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.6 + i * 0.2 }}
            >
              {fact.label}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function AboutGithubSection() {
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false to trigger every time
    threshold: 0.1,
  })

  const stats = [
    { icon: <FaCodeBranch />, label: 'Open Source Contributions', value: '3+' },
    { icon: <FaLaptopCode />, label: 'Experience', value: '1.5+ Years' },
    { icon: <FaTools />, label: 'Tech Stack', value: '10+ Tools' },
    { icon: <FaFolderOpen />, label: 'Repositories', value: '25+' }, 
    { icon: <FaAward />, label: 'Achievements', value: '5+' },
  ]

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="py-24 px-6 md:px-12"
    >
      {/* Heading */}
      <motion.h2 
        className="text-3xl md:text-4xl font-bold text-center mb-20"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 15,
          duration: 0.8
        }}
      >
        <motion.span 
          className="text-[#22ff99]"
          whileHover={{ scale: 1.1 }}
        >
          Get to{" "}
        </motion.span>
        <motion.span 
          className="text-white"
          whileHover={{ scale: 1.1 }}
        >
          Know{" "}
        </motion.span>
        <motion.span 
          className="text-[#22ff99]"
          whileHover={{ scale: 1.1 }}
        >
          Me
        </motion.span>
      </motion.h2>

      {/* Animated Stats Section */}
      <AnimatedStats stats={stats} />

      {/* Animated Content Section */}
      <AnimatedContentSection />
    </motion.section>
  )
}