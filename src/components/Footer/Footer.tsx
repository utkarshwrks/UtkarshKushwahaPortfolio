"use client";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { siteCopy } from "@/lib/site-settings";

const socials = [
  { icon: <FaGithub />, href: "https://github.com/utkarshwrks", label: "GitHub" },
  { icon: <FaLinkedin />, href: "https://linkedin.com/in/utkarshwrks", label: "LinkedIn" },
  { icon: <FaTwitter />, href: "https://x.com/utkarshwrks", label: "Twitter" },
  { icon: <FaInstagram />, href: "https://www.instagram.com/_.utkrashh._", label: "Instagram" },
];

const linkCls = "text-muted transition-colors hover:text-brand-300";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-elevated px-6 py-16 text-content">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-12">
        {/* About */}
        <div className="flex flex-col gap-5 md:col-span-4">
          <Link href="/" className="group flex items-center gap-1 font-mono text-xl font-bold md:text-2xl">
            <span className="text-brand-neon transition-colors group-hover:text-content">$</span>
            <span className="text-content transition-colors group-hover:text-brand-neon">Utkarsh</span>
            <span className="text-brand-neon transition-colors group-hover:text-content">--dev</span>
          </Link>

          <p className="max-w-sm text-sm leading-relaxed text-muted">
            I&apos;m a Full-Stack Developer passionate about building scalable backend systems
            and integrating AI to create smarter web experiences.
          </p>

          <div className="mt-2 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-[var(--r-md)] border border-border bg-surface-1 text-lg text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:text-brand-300"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-content">Quick Links</h2>
          <ul className="space-y-3 text-sm">
            <li><Link href="/about" className={linkCls}>About</Link></li>
            <li><Link href="/#projects" className={linkCls}>Projects</Link></li>
            <li><Link href="/#skills" className={linkCls}>Skills</Link></li>
            <li><Link href="/#contact" className={linkCls}>Contact</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="md:col-span-3">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-content">Resources</h2>
          <ul className="space-y-3 text-sm">
            <li><a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={linkCls}>Resume</a></li>
            <li><Link href="/#experience" className={linkCls}>Experience</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="md:col-span-3">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-content">Services</h2>
          <ul className="space-y-3 text-sm">
            {siteCopy.footerServices.map((s) => (
              <li key={s.label}><Link href={s.href} className={linkCls}>{s.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-2 border-t border-border pt-8 text-sm text-subtle md:flex-row">
        <p>© {new Date().getFullYear()} <span className="font-semibold text-brand-300">Utkarsh Kushwaha</span>. All rights reserved.</p>
        <p className="font-mono text-subtle">{siteCopy.footerTagline}</p>
      </div>
    </footer>
  );
}
