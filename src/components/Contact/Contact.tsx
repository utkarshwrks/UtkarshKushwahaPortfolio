'use client'

import { Mail, Linkedin, MapPin, Calendar, Github, Instagram, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'
import { defaultSettings, siteCopy } from '@/lib/site-settings'

const SOCIALS = defaultSettings.socials
const CONTACT_NOTES = defaultSettings.contact?.notes ?? []
const CDESC = siteCopy.contactDescriptions

// Fixed animation variants with TypeScript compatibility
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6
    }
  }
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 40,
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
    y: 30 
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

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Animated Contact Card Component
type ContactMethod = { icon: React.ReactNode; title: string; value: string; link: string; description: string }
type SocialLink = { icon: React.ReactNode; name: string; link: string; color: string }

function AnimatedContactCard({ method }: { method: ContactMethod; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <motion.a
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      href={method.link}
      target={method.link.startsWith('http') ? '_blank' : '_self'}
      rel="noreferrer"
      className="flex items-center gap-3 p-4 bg-surface-1/60 rounded-lg border border-border shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer w-full backdrop-blur-sm"
      whileHover={{ 
        y: -6,
        scale: 1.02,
        borderColor: "rgba(34, 197, 94, 0.3)",
        transition: { type: "spring" as const, stiffness: 400, damping: 15 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Animated Icon */}
      <motion.div 
        className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white shadow-md"
        whileHover={{ 
          scale: 1.1,
          rotate: 5,
          transition: { type: "spring" as const, stiffness: 400 }
        }}
        animate={{
          background: [
            "linear-gradient(135deg, #10b981, #06b6d4)",
            "linear-gradient(135deg, #06b6d4, #10b981)",
            "linear-gradient(135deg, #10b981, #06b6d4)"
          ]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <motion.div
          whileHover={{ scale: 1.2 }}
        >
          {method.icon}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="flex-1">
        <motion.h3 
          className="text-sm font-bold text-content mb-1"
          whileHover={{ x: 2 }}
        >
          {method.title}
        </motion.h3>
        <motion.p 
          className="text-brand-300 font-semibold text-xs mb-1"
          whileHover={{ x: 1 }}
        >
          {method.value}
        </motion.p>
        <motion.p 
          className="text-muted text-xs leading-tight"
          variants={fadeIn}
        >
          {method.description}
        </motion.p>
      </div>

      {/* Hover Arrow */}
      <motion.div
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ x: -10 }}
        whileHover={{ x: 0 }}
      >
        ↗
      </motion.div>
    </motion.a>
  )
}

// Animated Social Link Component
function AnimatedSocialLink({ social }: { social: SocialLink; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <motion.a
      ref={ref}
      href={social.link}
      target="_blank"
      rel="noreferrer"
      className={`p-3 bg-surface-2/50 rounded-lg border border-border text-muted transition-all duration-300 backdrop-blur-sm ${social.color}`}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
          opacity: 1, 
          scale: 1,
          transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 15
          }
        }
      }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.15,
        y: -2,
        borderColor: "rgba(34, 197, 94, 0.5)",
        transition: { type: "spring" as const, stiffness: 400 }
      }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5, ease: "easeInOut" as const }}
      >
        {social.icon}
      </motion.div>
    </motion.a>
  )
}

// Animated Input Field Component
function AnimatedInput({ label, id, type = "text", placeholder, value, onChange }: { label: string; id: string; type?: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
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
      <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">
        {label}
      </label>
      <motion.input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 bg-surface-2/50 border border-border rounded-xl text-content placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
        placeholder={placeholder}
        whileFocus={{
          scale: 1.02,
          borderColor: "#10b981",
          boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
        }}
        whileHover={{
          borderColor: "rgba(34, 197, 94, 0.5)",
          transition: { duration: 0.2 }
        }}
      />
    </motion.div>
  )
}

// Animated Textarea Component
function AnimatedTextarea({ label, id, placeholder, rows = 8, value, onChange }: { label: string; id: string; placeholder: string; rows?: number; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
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
      <label htmlFor={id} className="block text-sm font-medium text-muted mb-2">
        {label}
      </label>
      <motion.textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={onChange}
        required
        className="w-full px-4 py-3 bg-surface-2/50 border border-border rounded-xl text-content placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-300 resize-none backdrop-blur-sm"
        placeholder={placeholder}
        whileFocus={{
          scale: 1.01,
          borderColor: "#10b981",
          boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)"
        }}
        whileHover={{
          borderColor: "rgba(34, 197, 94, 0.5)",
          transition: { duration: 0.2 }
        }}
      />
    </motion.div>
  )
}

// Status Info Card Component
function StatusInfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <motion.div 
      ref={ref}
      className="flex items-center gap-3 p-3 bg-surface-2/40 rounded-lg border border-border backdrop-blur-sm"
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ 
        y: -2,
        borderColor: "rgba(34, 197, 94, 0.3)",
        transition: { type: "spring" as const, stiffness: 400 }
      }}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center text-white">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-content">{title}</p>
        <p className="text-brand-300 text-[10px] font-medium">{value}</p>
      </div>
    </motion.div>
  )
}

export default function Contact() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Links derive from editable Site settings → socials, so updating socials
  // in the admin keeps these contact cards in sync.
  const contactMethods = [
    {
      icon: <Mail className="w-4 h-4" />,
      title: "Email",
      value: SOCIALS.email,
      link: `mailto:${SOCIALS.email}`,
      description: CDESC.email
    },
    {
      icon: <Linkedin className="w-4 h-4" />,
      title: "LinkedIn",
      value: "View Profile",
      link: SOCIALS.linkedin,
      description: CDESC.linkedin
    },
    {
      icon: <Github className="w-4 h-4" />,
      title: "GitHub",
      value: "View Repositories",
      link: SOCIALS.github,
      description: CDESC.github
    },
    {
      icon: <Instagram className="w-4 h-4" />,
      title: "Instagram",
      value: "Follow me",
      link: SOCIALS.instagram,
      description: CDESC.instagram
    }
  ]

  const socialLinks = [
    {
      icon: <Twitter className="w-5 h-5" />,
      name: "Twitter",
      link: "https://x.com/utkarshwrks",
      color: "hover:text-blue-400"
    },
    {
      icon: <Github className="w-5 h-5" />,
      name: "GitHub", 
      link: "https://github.com/utkarshwrks",
      color: "hover:text-gray-300"
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      name: "Instagram",
      link: "https://www.instagram.com/_.utkrashh._", 
      color: "hover:text-pink-500"
    },
    {
      icon: <Linkedin className="w-5 h-5" />,
      name: "LinkedIn",
      link: "https://linkedin.com/in/utkarshwrks",
      color: "hover:text-blue-400"
    }
  ]

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission using Formspree
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Using Formspree for reliable form submission
      const response = await fetch('https://formspree.io/f/mjkaoebn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _replyto: formData.email,
          _subject: formData.subject || 'Contact from Portfolio'
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        throw new Error('Form submission failed')
      }
      
    } catch (error) {
      setSubmitStatus('error')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="w-full py-16 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <motion.div
          variants={slideInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mb-14 flex flex-col items-center gap-3 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-brand-500/25 bg-brand-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-brand-300">
            <Mail className="h-3.5 w-3.5" />
            {siteCopy.contact.eyebrow}
          </span>
          <motion.h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {siteCopy.contact.title}{siteCopy.contact.title ? ' ' : ''}
            <span className="text-gradient-animated">{siteCopy.contact.highlight}</span>
          </motion.h2>
          <motion.p variants={fadeIn} className="max-w-2xl text-base leading-relaxed text-muted">
            {siteCopy.contact.subtitle}
          </motion.p>
        </motion.div>

        {/* Contact Methods - Stretched Horizontal Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
        >
          {contactMethods.map((method, index) => (
            <AnimatedContactCard key={index} method={method} index={index} />
          ))}
        </motion.div>

        {/* Contact Form - Full Width */}
        <motion.div
          variants={slideInUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="w-full"
        >
          <motion.div 
            className="p-8 bg-surface-1/60 rounded-2xl border border-border shadow-lg backdrop-blur-sm"
            whileHover={{ 
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
              transition: { duration: 0.3 }
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side - Input Fields + Status Info */}
                <motion.div 
                  className="lg:w-2/5"
                  variants={staggerContainer}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <div className="space-y-6">
                    <AnimatedInput 
                      label="Your Name"
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    
                    <AnimatedInput 
                      label="Email Address"
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />

                    <AnimatedInput 
                      label="Subject"
                      id="subject"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={handleInputChange}
                    />

                    {/* Status & Location Info */}
                    <motion.div 
                      className="grid grid-cols-2 gap-4 pt-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                    >
                      <StatusInfoCard 
                        icon={<MapPin className="w-3 h-3" />}
                        title="Location"
                        value="Open to Remote"
                      />
                      
                      <StatusInfoCard 
                        icon={<Calendar className="w-3 h-3" />}
                        title="Status"
                        value="Open to Opportunities"
                      />
                    </motion.div>

                    {/* Social Media Links */}
                    <motion.div 
                      className="pt-4"
                      variants={fadeIn}
                      initial="hidden"
                      animate={inView ? "visible" : "hidden"}
                    >
                      <p className="text-sm font-medium text-muted mb-3">Follow me on</p>
                      <motion.div 
                        className="flex gap-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate={inView ? "visible" : "hidden"}
                      >
                        {socialLinks.map((social, index) => (
                          <AnimatedSocialLink key={index} social={social} index={index} />
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Side - Message and Button */}
                <motion.div 
                  className="lg:w-3/5 flex flex-col"
                  variants={staggerContainer}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <div className="flex-1">
                    <AnimatedTextarea 
                      label="Message"
                      id="message"
                      placeholder="Tell me about your project or just say hello..."
                      rows={12}
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-6"
                    variants={fadeIn}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                  >
                    <div className="text-xs text-muted text-center sm:text-left">
                      {CONTACT_NOTES.map((note, i) => (
                        <p key={i} className={i > 0 ? 'mt-1' : ''}>{note}</p>
                      ))}
                    </div>
                    
                    <div className="flex flex-col items-center gap-2">
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 text-base w-full sm:w-auto backdrop-blur-sm relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ 
                          scale: isSubmitting ? 1 : 1.05,
                          boxShadow: isSubmitting ? "none" : "0 10px 30px rgba(16, 185, 129, 0.3)",
                          transition: { type: "spring" as const, stiffness: 400 }
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className="relative z-10"
                          whileHover={{ x: isSubmitting ? 0 : 2 }}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </motion.span>
                        
                        {/* Button Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.8, ease: "easeInOut" as const }}
                        />
                      </motion.button>

                      {/* Status Messages - Positioned further below */}
                      {submitStatus === 'success' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-green-400 text-sm mt-2"
                        >
                          ✓ Message sent successfully! I&apos;ll get back to you soon.
                        </motion.div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center text-red-400 text-sm mt-2"
                        >
                          ✗ Failed to send message. Please try again or email me directly.
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
