'use client'
import Image from 'next/image'
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Reduced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.5
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const slideInLeft = {
  hidden: { 
    opacity: 0, 
    x: -40 
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const slideInRight = {
  hidden: { 
    opacity: 0, 
    x: 40 
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  }
}

// Animated Profile Card Component
function AnimatedProfileCard() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      variants={slideInLeft}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-gray-900 border border-green-500 rounded-2xl p-6 flex flex-col items-center text-center shadow-lg"
      whileHover={{ 
        y: -3,
        transition: { duration: 0.3 }
      }}
    >
      {/* Profile Image */}
      <motion.div 
        className="w-32 h-32 rounded-full overflow-hidden border-2 border-green-500 shadow-md mb-4"
        variants={fadeInUp}
        whileHover={{ 
          scale: 1.03,
          transition: { duration: 0.3 }
        }}
      >
        <Image
          src="/saru.jpg"
          alt="Utkarsh Kushwaha"
          width={128}
          height={128}
          className="object-cover"
        />
      </motion.div>

      {/* Name */}
      <motion.h2 
        className="text-xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4"
        variants={fadeInUp}
      >
        UTKARSH KUSHWAHA
      </motion.h2>
      
      <motion.p 
        className="text-sm text-gray-400 mt-1"
        variants={fadeInUp}
      >
        Full-Stack Developer | AI/ML Enthusiast
      </motion.p>

      {/* Contact Info */}
      <motion.div 
        className="mt-4 text-gray-300 text-sm space-y-2"
        variants={staggerContainer}
      >
        <motion.p 
          className="flex items-center justify-center gap-2"
          variants={fadeInUp}
          whileHover={{ color: "#4ade80" }}
        >
          <MapPin size={16} /> Jabalpur, Madhya Pradesh
        </motion.p>
        <motion.p 
          className="flex items-center justify-center gap-2"
          variants={fadeInUp}
          whileHover={{ color: "#4ade80" }}
        >
          <Mail size={16} /> utkarshkushwaha246@gmail.com
        </motion.p>
        <motion.p 
          className="flex items-center justify-center gap-2"
          variants={fadeInUp}
          whileHover={{ color: "#4ade80" }}
        >
          <Phone size={16} /> +91 8305212146
        </motion.p>
      </motion.div>

      {/* Connect Button */}
      <motion.a
  href="#contact" // <-- section ID you want to scroll to
  className="mt-5 inline-block bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
  variants={fadeInUp}
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
>
  Connect With Me
</motion.a>


      {/* Social Icons */}
      <motion.div 
        className="flex gap-4 mt-4 text-gray-300"
        variants={staggerContainer}
      >
        {[
          { icon: <FaGithub size={20} />, href: "https://github.com/utkarshwrks" },
          { icon: <FaLinkedin size={20} />, href: "https://linkedin.com/in/utkarshwrks" },
          { icon: <FaTwitter size={20} />, href: "https://x.com/utkarshwrks" }
        ].map((social, index) => (
          <motion.a 
            key={index}
            href={social.href}
            variants={fadeInUp}
            whileHover={{ 
              scale: 1.2,
              color: "#4ade80",
              transition: { duration: 0.2 }
            }}
            className="p-2 rounded-lg hover:bg-green-500/10 transition-colors"
          >
            {social.icon}
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  )
}

// Animated Skill Card Component
function AnimatedSkillCard({ title, description, delay }: { title: string; description: string; delay: number }) {
  return (
    <motion.div
      className="bg-gray-800 border border-green-500 rounded-lg p-4"
      variants={itemVariants}
      whileHover={{ 
        y: -4,
        borderColor: "#4ade80",
        transition: { duration: 0.3 }
      }}
      transition={{ delay }}
    >
      <h3 className="font-semibold text-green-400">{title}</h3>
      <p className="text-sm text-gray-400 mt-1">{description}</p>
    </motion.div>
  )
}

// Animated Stat Component
function AnimatedStat({ number, text, delay }: { number: string; text: string; delay: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
      className="text-center"
    >
      <p className="text-2xl font-bold">{number}</p>
      <p className="text-sm text-gray-400">{text}</p>
    </motion.div>
  )
}

// Animated Education Section
function AnimatedEducation() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const educationItems = [
    {
      icon: "🎓",
      institution: "Gyan Ganga Institute of Technology & Science, Jabalpur",
      details: "B.Tech CSE-AIML | CGPA: 7.33 | 2024 - 2028"
    },
    {
      icon: "🏫",
      institution: "Nachiketa Senior Secondary School, Jabalpur",
      details: "Class 12 (PCM+IP) | 84% | CBSE"
    },
    {
      icon: "🏫",
      institution: "Nachiketa Senior Secondary School, Jabalpur",
      details: "Class 10 (IT) | 80% | CBSE"
    }
  ]

  return (
    <motion.div
      ref={ref}
      variants={slideInRight}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="mt-10 bg-gray-900 border border-green-500 rounded-2xl p-6 shadow-lg"
      whileHover={{ 
        y: -3,
        transition: { duration: 0.3 }
      }}
    >
      <motion.h2 
        className="text-xl font-semibold text-green-400 mb-4"
        variants={fadeInUp}
      >
        Education
      </motion.h2>
      
      <motion.div 
        className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 text-gray-300"
        variants={containerVariants}
      >
        {educationItems.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex-1"
            whileHover={{ x: 3 }}
          >
            <p className="font-semibold flex items-center gap-2">
              <span>{item.icon}</span>
              {item.institution}
            </p>
            <p className="text-sm text-gray-400 mt-1">{item.details}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}

export default function About() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const skills = [
    {
      title: "Web Development",
      description: "Building responsive and interactive apps."
    },
    {
      title: "AI / ML",
      description: "Exploring intelligent systems and models."
    },
    {
      title: "Backend Systems",
      description: "Designing scalable APIs & microservices."
    }
  ]

  const stats = [
    { number: "5+", text: "Projects" },
    { number: "1.5+", text: "Years Exp." },
    { number: "10+", text: "Certifications" }
  ]

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="min-h-screen bg-black text-green-400 flex items-center justify-center px-6 py-12 relative overflow-hidden"
    >
      {/* Background Elements - Simplified */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Main Grid (Left + Right) */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Left Sidebar */}
          <AnimatedProfileCard />

          {/* Right Content */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="md:col-span-2 bg-gray-900 border border-green-500 rounded-2xl p-8 shadow-lg"
            whileHover={{ 
              y: -3,
              transition: { duration: 0.3 }
            }}
          >
            {/* Header */}
            <motion.h1 
              className="text-3xl font-bold mb-4"
              variants={fadeInUp}
            >
              Hello!
            </motion.h1>
            
            <motion.p 
              className="text-gray-300 leading-relaxed"
              variants={fadeInUp}
            >
              I'm <span className="text-green-400 font-semibold">Utkarsh Kushwaha</span>, 
              a Full-Stack Developer passionate about building scalable applications and 
              exploring AI/ML. I specialize in combining clean backend logic with seamless 
              frontend experiences to deliver powerful products.
            </motion.p>

            {/* Skills / Focus Areas */}
            <motion.div 
              className="grid sm:grid-cols-3 gap-4 mt-6"
              variants={staggerContainer}
            >
              {skills.map((skill, index) => (
                <AnimatedSkillCard
                  key={index}
                  title={skill.title}
                  description={skill.description}
                  delay={index * 0.05}
                />
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex gap-10 mt-8 text-center justify-center"
              variants={staggerContainer}
            >
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={index}
                  number={stat.number}
                  text={stat.text}
                  delay={index * 0.05}
                />
              ))}
            </motion.div>

            {/* Resume Button */}
            <motion.div 
              className="mt-6"
              variants={fadeInUp}
            >
              <motion.a
                href="/resume.pdf"
                className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-black px-5 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
                whileHover={{ 
                  scale: 1.03,
                }}
                whileTap={{ scale: 0.98 }}
              >
                View Resume
              </motion.a>
            </motion.div>
          </motion.div>
        </div>

        {/* Education Section */}
        <AnimatedEducation />
      </div>
    </motion.section>
  )
}