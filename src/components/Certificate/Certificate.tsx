'use client'
import { motion } from 'framer-motion'
import { 
  SiOracle, 
  SiCplusplus, 
  SiLinux 
} from 'react-icons/si'
import { FaCertificate, FaCloud, FaRobot } from 'react-icons/fa'

const certificatesData = [
  {
    title: "OCI 2024",
    issuer: "Oracle",
    icon: SiOracle,
    color: "from-red-500 to-red-700",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
    link: "https://www.linkedin.com/in/utkarshwrks/details/certifications/"
  },
  {
    title: "Gen AI Pro",
    issuer: "Oracle",
    icon: FaRobot,
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    link: "https://www.linkedin.com/in/utkarshwrks/details/certifications/"
  },
  {
    title: "C++ Essentials",
    issuer: "Cisco",
    icon: SiCplusplus,
    color: "from-blue-500 to-blue-700",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    link: "https://www.linkedin.com/in/utkarshwrks/details/certifications/"
  },
  {
    title: "Linux",
    issuer: "Red Hat",
    icon: SiLinux,
    color: "from-red-600 to-red-800",
    bgColor: "bg-red-600/10",
    borderColor: "border-red-600/20",
    link: "https://www.linkedin.com/in/utkarshwrks/details/certifications/"
  },
  {
    title: "APEX Dev",
    issuer: "Oracle",
    icon: FaCloud,
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    link: "https://www.linkedin.com/in/utkarshwrks/details/certifications/"
  }
]

function CertificatesSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-12"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">
          Certifications
        </h2>
        <p className="text-gray-400 text-xs">Professional certifications</p>
      </div>

      {/* Single horizontal line container */}
      <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
        {certificatesData.map((cert, index) => (
          <motion.a
            key={cert.title}
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="block flex-shrink-0"
          >
            <div className={`${cert.bgColor} ${cert.borderColor} rounded-lg p-3 border transition-all duration-200 hover:shadow-sm hover:shadow-gray-500/10 group cursor-pointer w-48`}>
              
              {/* Single line layout */}
              <div className="flex items-center justify-between">
                {/* Left side - Logo and title */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${cert.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}>
                    <cert.icon className="text-white text-xs" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-white group-hover:text-gray-200 transition-colors duration-200 truncate">
                      {cert.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 truncate">{cert.issuer}</p>
                  </div>
                </div>

                {/* Right side - Arrow only */}
                <motion.div
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                  className="text-gray-400 group-hover:text-white transition-colors duration-200 text-xs ml-2"
                >
                  →
                </motion.div>
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 text-center"
      >
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 border border-gray-800">
          <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
          <span className="text-[10px] text-gray-400">Always learning</span>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CertificatesSection