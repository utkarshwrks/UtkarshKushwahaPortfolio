// Singleton site settings (Hero + socials). Editable from the admin "Site" tab,
// committed to src/data/settings.json, imported statically by the public site.
import settingsJson from '@/data/settings.json'

export type SiteSettings = {
  hero: {
    greeting: string
    firstName: string
    nickname: string
    lastName: string
    roles: string[]
    description: string
    availableForWork: boolean
    availabilityText: string
    primaryCtaLabel: string
    primaryCtaHref: string
    resumeHref: string
  }
  socials: {
    github: string
    linkedin: string
    email: string
    twitter: string
    instagram: string
  }
  about: {
    bio: string
    funFacts: string[]
  }
  contact: {
    notes: string[]
  }
  copy?: Partial<SiteCopy>
}

// ----- Editable site copy (every section's headings + stray text) -----------
export type SectionCopy = { eyebrow: string; title: string; highlight: string; subtitle: string }

export type SiteCopy = {
  about: SectionCopy
  projects: SectionCopy
  experience: SectionCopy
  skills: SectionCopy
  codingStats: SectionCopy
  achievements: SectionCopy
  leadership: SectionCopy
  contact: SectionCopy
  aboutExperienceValue: string
  footerTagline: string
  footerServices: { label: string; href: string }[]
  contactDescriptions: { email: string; linkedin: string; github: string; instagram: string }
  terminalWhoami: string[]
  terminalSkills: string[]
}

export const DEFAULT_COPY: SiteCopy = {
  about: { eyebrow: 'About Me', title: 'Get to', highlight: 'Know Me', subtitle: '' },
  projects: {
    eyebrow: 'Selected Work',
    title: '',
    highlight: 'Projects',
    subtitle: "Things I've built, broken, and rebuilt better — from hackathon wins to weekend experiments.",
  },
  experience: {
    eyebrow: 'Experience',
    title: '',
    highlight: 'Professional Journey',
    subtitle: 'Because chai and code is apparently a career path ☕💻',
  },
  skills: {
    eyebrow: 'Tech Stack',
    title: 'Skills &',
    highlight: 'Technologies',
    subtitle: 'Tools and technologies I use to bring ideas to life.',
  },
  codingStats: {
    eyebrow: 'Live Data',
    title: 'Live',
    highlight: 'Coding Stats',
    subtitle: 'Pulled live from LeetCode & Codeforces — real numbers, not claims.',
  },
  achievements: {
    eyebrow: 'Achievements',
    title: 'Wins &',
    highlight: 'Hackathons',
    subtitle: 'My journey through competitive programming and hackathons.',
  },
  leadership: {
    eyebrow: 'Leadership',
    title: 'Community &',
    highlight: 'Leadership',
    subtitle: 'Strengthening the developer community through open-source work, mentoring, and thought leadership.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Get in',
    highlight: 'Touch',
    subtitle: 'Feel free to reach out for collaborations or just a friendly hello.',
  },
  aboutExperienceValue: '1.5+ yrs',
  footerTagline: '> Made with Next.js, TypeScript & zero regard for deadlines ⏳',
  footerServices: [
    { label: 'Projects', href: '/#projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#contact' },
  ],
  contactDescriptions: {
    email: "Let's start a conversation",
    linkedin: 'Connect professionally',
    github: 'Check my work',
    instagram: 'Daily updates',
  },
  terminalWhoami: [
    '👨‍💻 Utkarsh Kushwaha | Full-Stack Developer',
    'Passionate about building digital experiences that matter 🚀',
  ],
  terminalSkills: [
    '💼 Tech Stack:',
    'Frontend: React, Next.js, TypeScript, Tailwind',
    'Backend: Node.js, Django, Python',
    'Database: MongoDB, PostgreSQL, Firebase',
    'Tools: Git, Docker, AWS, Vercel',
  ],
}

/** Deep-merge saved copy over the defaults so missing keys always have a value. */
export function mergeCopy(override?: Partial<SiteCopy>): SiteCopy {
  const out = { ...DEFAULT_COPY } as Record<string, unknown>
  const ov = (override ?? {}) as Record<string, unknown>
  for (const k of Object.keys(DEFAULT_COPY)) {
    const o = ov[k]
    if (o == null) continue
    const def = (DEFAULT_COPY as Record<string, unknown>)[k]
    if (Array.isArray(def)) out[k] = o
    else if (def && typeof def === 'object') out[k] = { ...(def as object), ...(o as object) }
    else out[k] = o
  }
  return out as SiteCopy
}

export const SETTINGS_PATH = 'src/data/settings.json'

// Local committed JSON doubles as the default/fallback.
export const defaultSettings = settingsJson as SiteSettings

// Merged, always-complete copy for the public site to consume.
export const siteCopy: SiteCopy = mergeCopy(defaultSettings.copy)
