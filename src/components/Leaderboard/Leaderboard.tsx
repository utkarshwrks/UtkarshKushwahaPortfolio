'use client'

import { ExternalLink, Users, Target } from 'lucide-react'

export default function Leadership() {
  const leaderships = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "AIALCHEMIST",
      role: "Technical Lead",
      description: "Leading student org focused on AI & web dev, driving tech innovation & mentoring members.",
      link: "https://aialchemist.vercel.app/"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "HackWithIndia GGITS", 
      role: "Campus President",
      description: "Leading campus chapter, organizing hackathons & coding events for 500+ students.",
      link: "https://www.hackwithindia.in/"
    }
  ]

  return (
    <div className="w-full py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Community & Leadership
          </h2>
                   <div className="w-20 h-1 bg-gray-600 mx-auto my-3 rounded-full"></div>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
           Engaged in strengthening the developer community through open-source contributions, mentoring, and thought leadership
          </p>
         
        </div>

        {/* Horizontal Rectangular Layout */}
        <div className="flex flex-col md:flex-row gap-16">
          {leaderships.map((leadership, index) => (
            <div 
              key={index}
              className="flex-1 relative p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-4px] group"
            >
              {/* Icon */}
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md">
                {leadership.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-2">
                {leadership.title}
              </h3>
              
              <p className="text-green-400 font-semibold mb-3">
                {leadership.role}
              </p>
              
              <p className="text-zinc-300 leading-relaxed mb-4 text-sm">
                {leadership.description}
              </p>

              {/* Link */}
              <a 
                href={leadership.link}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-700/30 rounded-lg hover:bg-green-500 transition-all duration-300 group-hover:scale-105 text-white text-sm font-medium shadow-sm"
              >
                <ExternalLink className="w-3 h-3" />
                Learn More
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}