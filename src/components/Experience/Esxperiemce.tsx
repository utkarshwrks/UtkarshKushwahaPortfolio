'use client'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Animation variants (smoothed out) - FIXED VERSION
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      duration: 0.7
    }
  }
}

const slideInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 18,
      duration: 0.7
    }
  }
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      ease: "easeOut" as const
    }
  }
}

// Animated Experience Card Component
function AnimatedExperienceCard({ exp, index }: { exp: any; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative"
    >
      {/* Timeline connector */}
      {index !== 0 && (
        <motion.div
          className="absolute -top-10 left-8 w-0.5 h-10 bg-gradient-to-b from-emerald-400/40 to-transparent md:left-1/2 md:-translate-x-1/2"
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
        />
      )}

      <motion.div
        className="relative flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900/30 p-6 rounded-2xl shadow-md 
                   border-l-4 border-emerald-400 transition-all duration-300 group hover:scale-[1.01] hover:shadow-lg
                   backdrop-blur-sm hover:border-emerald-300 hover:bg-gray-900/40"
        whileHover={{
          y: -4,
          transition: { type: "spring" as const, stiffness: 200, damping: 20 }
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Left content */}
        <div className="flex-1 text-left relative z-10">
          <motion.h3
            className="text-xl font-semibold transition-all duration-300 group-hover:text-emerald-300"
          >
            {exp.company}
          </motion.h3>

          <p className="text-emerald-400 transition-all duration-300 group-hover:text-emerald-300">
            {exp.role}
          </p>

          <p className="text-gray-400 text-sm mb-2">
            {exp.time}
          </p>

          <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3">
            {exp.points.map((point: string, idx: number) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                className="transition-all duration-300 hover:text-white hover:translate-x-1"
                dangerouslySetInnerHTML={{ __html: point }}
              />
            ))}
          </ul>

          <motion.a
            href={exp.certLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
            whileHover={{ x: 4 }}
          >
            <span>View Certificate</span>
            <motion.span
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" as const }}
            >
              <ExternalLink size={16} />
            </motion.span>
          </motion.a>
        </div>

        {/* Logo */}
        <motion.div
          className="flex-shrink-0 relative z-10"
          whileHover={{
            scale: 1.05,
            rotate: 3,
            transition: { type: "spring" as const, stiffness: 300, damping: 20 }
          }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400/15 blur-md"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.6, 0.4]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" as const
              }}
            />
            <Image
              src={exp.logo}
              alt={`${exp.company} Logo`}
              width={70}
              height={70}
              className="rounded-full border border-emerald-400 p-2 bg-gray-800 relative z-10 group-hover:border-emerald-300 transition-colors"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export default function ExperienceSection() {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 })

  const experiences = [
    {
      logo: '/edunetfoundation_logo.jpeg',
      company: 'Edunet Foundation – SHEEL',
      role: 'Artificial Intelligence & Machine Learning Intern',
      time: 'June 2025 – July 2025 • Remote',
      points: [
        'Engineered a Water Quality Prediction System with 92% accuracy using Python, Pandas, and Scikit-learn.',
        'Reduced manual testing time by 40% and boosted reliability by 25% through feature engineering.'
      ],
      certLink: 'https://www.linkedin.com/posts/utkarshwrks_certificate-activity-7353861656130572302-VdI9'
    },
    {
      logo: '/tvlogo.jpg',
      company: 'Team Vasiliades',
      role: 'Backend Developer',
      time: 'Dec 2024 – Present • Remote/Onsite',
      points: [
        'Developed and maintained 5+ projects including AlgoVisualizer and VoteX.',
        'Built interactive backends and real-time systems using React, Next.js, Django, and FastAPI.'
      ],
      certLink: 'https://www.linkedin.com/posts/utkarshwrks_teamvasiliades-genethon2024-proudmoment-activity-7278720420164390913-wNb3'
    },
    {
      logo: '/girlscriptsoc_logo.jpeg',
      company: 'GirlScript Summer of Code (GSSoC)',
      role: 'Open Source Contributor',
      time: '2025 • Remote',
      points: [
        'Selected as a Contributor in GSSoC 2025.',
        'Contributed to 2 repositories with meaningful pull requests and feature improvements.'
      ],
      certLink: 'https://www.linkedin.com/posts/utkarshwrks_gssoc-opensource-developerjourney-activity-7352636000742879232-jwb6'
    }
  ]

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      id="experience"
      className="min-h-screen flex flex-col px-6 md:px-20 py-16 text-white relative overflow-hidden"
    >
      {/* Background blobs (softer motion) */}
      <motion.div
        className="absolute top-1/4 -left-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as const }}
      />

      {/* Heading */}
      <motion.div variants={slideInUp} className="text-center mb-16 relative z-10">
        <motion.h2
          className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4"
          whileHover={{ scale: 1.03 }}
        >
          Professional Experience
        </motion.h2>

        <motion.div
          className="w-20 h-1 bg-gradient-to-r from-green-400 to-cyan-400 mx-auto my-3 rounded-full"
          initial={{ width: 0 }}
          animate={inView ? { width: 80 } : { width: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const }}
        />

        <motion.p variants={fadeIn} className="text-gray-400 italic">
          Because Chai and code is apparently a career path ☕💻
        </motion.p>
      </motion.div>

      {/* Cards */}
      <motion.div variants={containerVariants} className="flex flex-col gap-16 w-full relative z-10">
        {experiences.map((exp, i) => (
          <AnimatedExperienceCard key={i} exp={exp} index={i} />
        ))}
      </motion.div>
    </motion.section>
  )
}