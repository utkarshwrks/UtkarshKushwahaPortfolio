'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * Global animated backdrop, mounted once behind all content.
 *  - Drifting emerald "aurora" blobs (pure CSS keyframe, GPU transform only)
 *  - Faint perspective grid that parallaxes on scroll
 *  - Radial vignette so content stays readable
 * Fixed + pointer-events-none so it never interferes with the page.
 */
export default function DynamicBackground() {
  const { scrollYProgress } = useScroll()
  // Subtle parallax: grid drifts up, aurora hue shifts as you scroll.
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])
  const auroraY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-bg"
    >
      {/* Aurora blobs */}
      <motion.div style={{ y: auroraY }} className="absolute inset-0">
        <div
          className="absolute -left-[10%] -top-[15%] h-[55vmax] w-[55vmax] rounded-full opacity-[0.18] blur-[90px]"
          style={{
            background: 'radial-gradient(circle at center, var(--brand-400), transparent 60%)',
            animation: 'aurora-drift 22s ease-in-out infinite',
          }}
        />
        <div
          className="absolute -right-[15%] top-[20%] h-[45vmax] w-[45vmax] rounded-full opacity-[0.14] blur-[100px]"
          style={{
            background: 'radial-gradient(circle at center, var(--brand-600), transparent 60%)',
            animation: 'aurora-drift 28s ease-in-out infinite reverse',
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[30%] h-[50vmax] w-[50vmax] rounded-full opacity-[0.10] blur-[110px]"
          style={{
            background: 'radial-gradient(circle at center, var(--brand-neon), transparent 60%)',
            animation: 'aurora-drift 34s ease-in-out infinite',
          }}
        />
      </motion.div>

      {/* Faint grid */}
      <motion.div
        style={{
          y: gridY,
          backgroundImage:
            'linear-gradient(to right, rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(16,185,129,0.06) 1px, transparent 1px)',
          backgroundSize: '54px 54px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 35%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 35%, transparent 80%)',
        }}
        className="absolute inset-0"
      />

      {/* Ultra-fine film grain for premium depth */}
      <div className="noise absolute inset-0" />

      {/* Top + bottom vignette for readability */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--bg)_100%)]" />
    </div>
  )
}
