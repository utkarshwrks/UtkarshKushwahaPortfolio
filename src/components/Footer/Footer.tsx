"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-green-400 py-16 px-6 border-t border-gray-600"> {/* Changed py-12 to py-16 */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12">
        
        {/* Left - About (wider column) */}
        <div className="md:col-span-4 flex flex-col gap-5">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-1">
            <Link href="/" className="flex items-center gap-1 group">
              <span className="text-[#22ff99] group-hover:text-white transition-colors">$</span>
              <span className="text-white group-hover:text-[#22ff99] transition-colors">Utkarsh</span>
              <span className="text-[#22ff99] group-hover:text-white transition-colors">--dev</span>
            </Link>
          </h2>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            I'm a Full-Stack Developer passionate about building scalable backend systems 
            and integrating AI to create smarter web experiences.
          </p>

          {/* Social Icons */}
          <div className="flex gap-6 mt-3 text-xl">
            <a href="https://github.com/utkarshwrks" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/utkarshwrks" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <FaLinkedin />
            </a>
            <a href="https://www.instagram.com/_.utkrashh._" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com/in/utkarshwrks" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
              <FaInstagram />
            </a>
          </div>
        </div>

        {/* Middle - Quick Links */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-white">Quick Links</h2>
          <ul className="space-y-3 text-white">
            <li><Link href="/about" className="hover:text-green-200 transition-colors">About</Link></li>
            <li><Link href="/#projects" className="hover:text-green-200 transition-colors">Projects</Link></li>
            <li><Link href="/#skills" className="hover:text-green-200 transition-colors">Skills</Link></li>
            <li><Link href="/#contact" className="hover:text-green-200 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4 text-white">Resources</h2>
          <ul className="space-y-3 text-white">
            <li>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-green-200 transition-colors">
                Resume
              </a>
            </li>
            <li>
              <Link href="/#experience" className="hover:text-green-200 transition-colors">Experience</Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-bold mb-4 text-white">Services</h2>
          <ul className="space-y-3 text-white">
            <li><Link href="/services/web-development" className="hover:text-green-200 transition-colors">Web Development</Link></li>
            <li><Link href="/services/web-design" className="hover:text-green-200 transition-colors">Web Design</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar - Increased spacing */}
      <div className="mt-12 border-t border-gray-600 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"> {/* Changed mt-8 to mt-12 and pt-4 to pt-8 */}
        <p>© {new Date().getFullYear()} <span className="text-green-500 font-semibold">Utkarsh Kushwaha</span>. All rights reserved.</p>
        <p className="mt-2 md:mt-0 text-green-500">&gt; Made with Next.js, TypeScript & zero regard for deadlines ⏳</p>
      </div>
    </footer>
  );
}