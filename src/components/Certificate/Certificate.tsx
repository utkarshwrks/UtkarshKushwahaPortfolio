'use client'
import { motion } from 'framer-motion'
import { 
  SiOracle, 
  SiCplusplus, 
  SiLinux 
} from 'react-icons/si'
import { FaCertificate, FaCloud, FaRobot } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import certificatesJson from '@/data/certificates.json'

// Map the JSON "icon" string key -> actual icon component.
// Add new keys here if you reference a new icon from the admin panel.
const iconMap: Record<string, IconType> = {
  oracle: SiOracle,
  cplusplus: SiCplusplus,
  linux: SiLinux,
  cloud: FaCloud,
  robot: FaRobot,
  certificate: FaCertificate,
}

const certificatesData = certificatesJson.map((c) => ({
  ...c,
  icon: iconMap[c.icon] ?? FaCertificate,
}))

function CertificatesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <div className="mb-7 text-center">
        <h3 className="mb-2 text-2xl font-bold">
          <span className="text-gradient">Certifications</span>
        </h3>
        <p className="text-sm text-muted">Professional certifications &amp; credentials</p>
      </div>

      {/* Cards */}
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3">
        {certificatesData.map((cert, index) => (
          <motion.a
            key={cert.title}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
            whileHover={{ y: -3 }}
            className="group block w-56 flex-shrink-0"
          >
            <div className="flex items-center gap-3 rounded-[var(--r-md)] border border-border bg-surface-1/60 p-3 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/30 hover:shadow-[var(--shadow-md)]">
              <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[var(--r-sm)] bg-gradient-to-br ${cert.color} transition-transform duration-300 group-hover:scale-110`}
              >
                <cert.icon className="text-sm text-white" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-content">{cert.title}</h4>
                <p className="truncate text-xs text-muted">{cert.issuer}</p>
              </div>

              <span className="text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-300">
                →
              </span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-7 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-[var(--r-pill)] border border-border bg-surface-1/60 px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400" />
          <span className="text-xs text-muted">Always learning</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CertificatesSection