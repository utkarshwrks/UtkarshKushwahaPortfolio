'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const fakeLogs = [
  { text: '▲ npm run dev', delay: 1200 },
  { text: '○ Compiling / ...', delay: 1000 },
  { text: '✓ Building components...', delay: 1100 },
  { text: '✓ Optimizing assets...', delay: 900 },
  { text: '✓ Starting development server...', delay: 800 },
  { text: '🚀 Ready in 3.1s', delay: 700 },
]

export default function Loader() {
  const [loading, setLoading] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)
  const [completedLines, setCompletedLines] = useState<number[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    if (currentLine >= fakeLogs.length) {
      setTimeout(() => setLoading(false), 1200)
      return
    }

    const timer = setTimeout(() => {
      setCompletedLines(prev => [...prev, currentLine])
      setCurrentLine(prev => prev + 1)
    }, fakeLogs[currentLine].delay)

    return () => clearTimeout(timer)
  }, [currentLine, isClient])

  // Terminal cursor animation
  const Cursor = () => (
    <motion.div
      className="inline-block w-2 h-4 bg-green-400 ml-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  )

  // Floating particles component - only render on client
  const FloatingParticles = () => {
    if (!isClient) return null

    return (
      <>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400/30 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 100),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 100),
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </>
    )
  }

  return (
    <AnimatePresence mode="wait">
      {loading && isClient && (
        <motion.div
          className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-green-400 font-mono flex items-center justify-center z-[9999] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 1.2, ease: "easeInOut" }
          }}
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 opacity-10"
            initial={{ scale: 1 }}
            animate={{ scale: 1.1 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full bg-gradient-conic from-green-400 via-transparent to-transparent" />
          </motion.div>

          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.02] bg-[length:50px_50px] bg-grid-white" />

          <div className="relative z-10 w-full max-w-2xl px-6">
            {/* Terminal header */}
            <motion.div
              className="flex items-center gap-2 mb-6 opacity-80"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="text-xs text-gray-500">terminal — zsh</div>
            </motion.div>

            {/* Terminal content */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-green-900/30 p-6 shadow-2xl">
              <div className="space-y-3 min-h-[200px]">
                {/* Welcome line */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-green-300"
                >
                  ➜ Welcome to my portfolio
                </motion.div>

                {/* Completed lines */}
                {completedLines.map((lineIndex) => (
                  <motion.div
                    key={lineIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex items-center"
                  >
                    <span className="text-green-400">{fakeLogs[lineIndex].text}</span>
                    {lineIndex === fakeLogs.length - 1 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="ml-2 text-2xl"
                      >
                        ⚡
                      </motion.span>
                    )}
                  </motion.div>
                ))}

                {/* Current typing line */}
                {currentLine < fakeLogs.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                  >
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      transition={{
                        duration: 1.2,
                        ease: "easeOut"
                      }}
                      className="text-green-400 overflow-hidden whitespace-nowrap"
                    >
                      {fakeLogs[currentLine].text}
                    </motion.span>
                    <Cursor />
                  </motion.div>
                )}

                {/* Progress bar */}
                <motion.div
                  className="w-full bg-green-900/20 rounded-full h-1 mt-4 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: `${((currentLine + 1) / fakeLogs.length) * 100}%` 
                    }}
                    transition={{ 
                      duration: 0.8,
                      ease: "easeOut" 
                    }}
                  />
                </motion.div>

                {/* Loading indicator */}
                <motion.div
                  className="flex items-center gap-2 text-xs text-green-500/70 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border border-green-500 rounded-full"
                  />
                  Initializing portfolio...
                </motion.div>
              </div>
            </div>

            {/* Footer */}
            <motion.div
              className="text-center text-xs text-gray-600 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              Crafted with ⚡ by Utkarsh
            </motion.div>
          </div>

          {/* Floating particles - only rendered on client */}
          <FloatingParticles />
        </motion.div>
      )}
    </AnimatePresence>
  )
}