'use client'
import CertificatesSection from '@/components/Certificate/Certificate'
import { motion } from 'framer-motion'
import { 
  SiPython, 
  SiJavascript, 
  SiC, 
  SiCplusplus,
  SiMysql,
  SiHtml5,
  SiCss3,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiDjango,
  SiFlask,
  SiFirebase,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostman,
  SiVercel,
  SiLinux
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'

const skillsData = {
  programming: {
    title: "Programming Languages",
    color: "from-green-500 to-emerald-600",
    items: [
      { name: "Python", icon: SiPython },
      { name: "JavaScript", icon: SiJavascript },
      { name: "C", icon: SiC },
      { name: "C++", icon: SiCplusplus },
      { name: "SQL", icon: SiMysql },
    ]
  },
  web: {
    title: "Web Technologies",
    color: "from-blue-500 to-cyan-600", 
    items: [
      { name: "HTML5", icon: SiHtml5 },
      { name: "CSS3", icon: SiCss3 },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express", icon: SiExpress },
      { name: "Django", icon: SiDjango },
      { name: "Flask", icon: SiFlask },
    ]
  },
  database: {
    title: "Databases & Cloud",
    color: "from-purple-500 to-pink-600",
    items: [
      { name: "Firebase", icon: SiFirebase },
      { name: "MongoDB", icon: SiMongodb },
      { name: "MySQL", icon: SiMysql },
    ]
  },
  tools: {
    title: "Tools & Platforms",
    color: "from-orange-500 to-red-600",
    items: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Postman", icon: SiPostman },
      { name: "VS Code", icon: VscVscode },
      { name: "Vercel", icon: SiVercel },
      { name: "Linux", icon: SiLinux },
    ]
  }
}

export default function SkillsGrid() {
  return (
    <div className="min-h-screen py-20 px-4 bg-black text-gray-300">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Skills & Technologies
          </h2>
           <div className="w-20 h-1 bg-gray-600 mx-auto my-3 rounded-full"></div>
          <p className="text-gray-400 text-lg">Tools and technologies I use to bring ideas to life</p>
        </motion.div>

        {/* Swapped Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Databases & Cloud (Full Height) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 h-full">
              <div className="flex items-center mb-6">
                <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${skillsData.database.color} mr-3`}></div>
                <h3 className="text-xl font-bold text-white">{skillsData.database.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {skillsData.database.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative"
                  >
                    <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center aspect-square border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
                      <item.icon 
                        size={24} 
                        className="text-gray-400 group-hover:text-white transition-colors duration-300 mb-2" 
                      />
                      <span className="text-sm text-center text-gray-400 group-hover:text-white transition-colors duration-300">
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Columns - Other Skills in 2x2 Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top Left - Web Technologies */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center mb-6">
                <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${skillsData.web.color} mr-3`}></div>
                <h3 className="text-xl font-bold text-white">{skillsData.web.title}</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {skillsData.web.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative"
                  >
                    <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center aspect-square border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
                      <item.icon 
                        size={24} 
                        className="text-gray-400 group-hover:text-white transition-colors duration-300 mb-2" 
                      />
                      <span className="text-sm text-center text-gray-400 group-hover:text-white transition-colors duration-300">
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Top Right - Tools & Platforms */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center mb-6">
                <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${skillsData.tools.color} mr-3`}></div>
                <h3 className="text-xl font-bold text-white">{skillsData.tools.title}</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {skillsData.tools.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="group relative"
                  >
                    <div className="bg-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center aspect-square border border-gray-700 group-hover:border-gray-600 transition-all duration-300">
                      <item.icon 
                        size={24} 
                        className="text-gray-400 group-hover:text-white transition-colors duration-300 mb-2" 
                      />
                      <span className="text-sm text-center text-gray-400 group-hover:text-white transition-colors duration-300">
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Bottom Full Width - Programming Languages (Responsive) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="md:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-center mb-6">
                <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${skillsData.programming.color} mr-3`}></div>
                <h3 className="text-xl font-bold text-white">{skillsData.programming.title}</h3>
              </div>
              
              {/* Responsive Programming Languages Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 md:gap-6 justify-items-center">
                {skillsData.programming.items.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    className="group relative"
                  >
                    <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center aspect-square border border-gray-700 group-hover:border-gray-600 transition-all duration-300 w-16 sm:w-20 md:w-24">
                      <item.icon 
                        size={20} 
                        className="text-gray-400 group-hover:text-white transition-colors duration-300 mb-1 sm:mb-2" 
                      />
                      <span className="text-xs sm:text-sm text-center text-gray-400 group-hover:text-white transition-colors duration-300">
                        {item.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>

        {/* Decorative footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gray-900 border border-gray-800">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-gray-400">Always learning new technologies</span>
          </div>
        </motion.div>
      </div>
      <CertificatesSection />
    </div>
  )
}