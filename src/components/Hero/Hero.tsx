'use client'
import TypingText from './TypingText'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaFileAlt, FaEnvelope } from 'react-icons/fa'
import { HiOutlineMail } from 'react-icons/hi'
import Lottie from 'lottie-react'
import laptopCoffee1 from '@/lottie/Green.json'
import { useInView } from 'react-intersection-observer'

// Animation variants - FIXED VERSION
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
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
      duration: 0.8
    }
  }
}

const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      duration: 1
    }
  }
}

const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 15,
      duration: 1
    }
  }
}

export default function Hero() {
  const selectedLottie = laptopCoffee1
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="flex flex-col md:flex-row items-center justify-between min-h-screen px-6 md:px-12 gap-12 pt-12 md:pt-16 text-center md:text-left"
    >

      {/* Left Side - Text */}
      <motion.div 
        variants={slideInLeft}
        className="flex-1 flex flex-col justify-center gap-6 md:gap-8 w-full"
      >
        
        {/* Intro */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-4xl md:text-5xl font-bold flex flex-wrap gap-1 -mt-6 md:-mt-12 justify-center md:justify-start"
        >
          <motion.span 
            className="text-[#22ff99]"
            whileHover={{ scale: 1.05 }}
          >
            Hi, I’m{" "}
          </motion.span>
          <motion.span 
            className="text-white"
            whileHover={{ scale: 1.05 }}
          >
            Utkarsh{" "}
          </motion.span>
          <motion.span 
            className="text-[#22ff99]"
            whileHover={{ scale: 1.05 }}
          >
            (ut-code-crush){" "}
          </motion.span>
          <motion.span 
            className="text-white"
            whileHover={{ scale: 1.05 }}
          >
            Kushwaha
          </motion.span>
        </motion.h1>

        {/* Typing Animation */}
        <motion.h2
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl font-mono text-[#22ff99] flex flex-wrap items-center gap-1 justify-center md:justify-start mt-2"
        >
          <span>let Utkarsh = {"{"} role: "</span>
          <span className="text-white flex">
            <TypingText className="inline" />
          </span>
          <span>"{"}"}</span>
        </motion.h2>

        {/* Description */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 max-w-full md:max-w-xl leading-relaxed mt-4 text-base sm:text-lg md:text-lg text-center md:text-left"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          I craft scalable web applications with a backend-first approach, integrating AI/ML solutions where they truly add value.
        </motion.p>

        {/* Contact & Resume Buttons */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-wrap justify-center md:justify-start gap-3 mt-4"
        >
          <motion.a
            href="#contact"
            className="flex items-center gap-2 px-4 py-2 border border-[#22ff99] rounded-md text-[#22ff99] hover:bg-[#22ff99] hover:text-black transition-colors"
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 10px 25px -5px rgba(34, 255, 153, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <HiOutlineMail className="text-[#22ff99] hover:text-black" />
            Contact
          </motion.a>

          <motion.a
            href="/resume.pdf"
            download
            className="flex items-center gap-2 px-4 py-2 border border-[#22ff99] rounded-md text-[#22ff99] hover:bg-[#22ff99] hover:text-black transition-colors"
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 10px 25px -5px rgba(34, 255, 153, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFileAlt className="text-[#22ff99] hover:text-black" />
            Resume
          </motion.a>
        </motion.div>

        {/* Social Icons */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center md:justify-start mt-4"
        >
          <div className="flex gap-6 md:gap-8">
            {[
              { icon: <FaGithub />, href: "https://github.com/utkarshwrks" },
              { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/utkarshwrks/" },
              { icon: <FaEnvelope />, href: "mailto:utkarshkushwaha246@gmail.com" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-[#22ff99] transition-colors text-2xl"
                whileHover={{ 
                  scale: 1.3,
                  y: -5,
                  rotate: 5
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring" as const, stiffness: 400 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Lottie Animation */}
      <motion.div 
        variants={slideInRight}
        className="flex-1 flex justify-center md:justify-end w-full"
      >
        <motion.div 
          className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[28rem] lg:h-[28rem]"
          whileHover={{ 
            scale: 1.05,
            rotate: 1,
            transition: { duration: 0.3 }
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            y: {
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse" as const,
              ease: "easeInOut" as const
            }
          }}
        >
          <Lottie animationData={selectedLottie} loop={true} />
        </motion.div>
      </motion.div>

    </motion.div>
  )
}