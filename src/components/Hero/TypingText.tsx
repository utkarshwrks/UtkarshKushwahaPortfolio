'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const DEFAULT_PHRASES = [
  'Full Stack Dev | Backend & AI Enthusiast',
  'Building Scalable Apps & AI Solutions',
  'Full Stack Engineer | Python, Node.js, Django',
  'Creating Intelligent Web Experiences',
  'Coder, Problem Solver, AI Explorer',
]

export default function TypingText({
  className = '',
  phrases = DEFAULT_PHRASES,
}: {
  className?: string
  phrases?: string[]
}) {
  const list = phrases.length ? phrases : DEFAULT_PHRASES
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentPhrase = list[index]
    let timeout: NodeJS.Timeout

    if (!isDeleting && text !== currentPhrase) {
      // Typing
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + 1))
      }, 100)
    } else if (!isDeleting && text === currentPhrase) {
      // Pause after typing complete
      timeout = setTimeout(() => setIsDeleting(true), 1500)
    } else if (isDeleting && text !== '') {
      // Deleting
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length - 1))
      }, 50)
    } else if (isDeleting && text === '') {
      // Move to next phrase after deleting
      setIsDeleting(false)
      setIndex((index + 1) % list.length)
    }

    return () => clearTimeout(timeout)
  }, [text, isDeleting, index, list])

  return (
    <div className={`text-sm sm:text-base font-medium ${className}`}>
      <span>{text}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-0.5"
      >
        ▊
      </motion.span>
    </div>
  )
}