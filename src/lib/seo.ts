import type { Metadata } from 'next'

/**
 * Single source of truth for site-wide SEO + identity. Everything (metadata,
 * JSON-LD, OG images, sitemap, manifest) reads from here so the personal brand
 * "Utkarsh Kushwaha" is reinforced consistently with zero duplicate signals.
 */

export const SITE_URL = 'https://utkarsh-kushwaha.vercel.app'
export const SITE_NAME = 'Utkarsh Kushwaha'
export const LOCALE = 'en_IN'

export const PERSON = {
  name: 'Utkarsh Kushwaha',
  alternateName: 'Utkarsh',
  jobTitle: 'Software Engineer',
  headline: 'Software Engineer · Backend & AI Developer',
  description:
    'Backend Developer specializing in Django, FastAPI, AI/ML, and scalable web applications.',
  email: 'utkarshkushwaha246@gmail.com',
  image: `${SITE_URL}/saru.jpg`,
  location: { city: 'Jabalpur', region: 'Madhya Pradesh', country: 'India' },
  alumniOf: {
    name: 'Gyan Ganga Institute of Technology and Science, Jabalpur',
    url: 'https://www.ggits.org/',
  },
  knowsAbout: [
    'Backend Development',
    'Django',
    'FastAPI',
    'Flask',
    'Python',
    'JavaScript',
    'TypeScript',
    'Next.js',
    'Node.js',
    'REST APIs',
    'Artificial Intelligence',
    'Machine Learning',
    'Data Structures and Algorithms',
    'System Design',
  ],
  // Verified public profiles — strengthens Google entity / Knowledge Graph linking.
  sameAs: [
    'https://github.com/utkarshwrks',
    'https://www.linkedin.com/in/utkarshwrks',
    'https://leetcode.com/u/utkarsh-246/',
    'https://codeforces.com/profile/utkarsh246',
    'https://x.com/utkarshwrks',
    'https://www.instagram.com/_.utkrashh._',
  ],
  twitterHandle: '@utkarshwrks',
} as const

export const DEFAULT_KEYWORDS = [
  'Utkarsh Kushwaha',
  'Utkarsh Kushwaha Developer',
  'Utkarsh Kushwaha AI',
  'Utkarsh Kushwaha Portfolio',
  'Utkarsh Kushwaha GGITS',
  'Utkarsh Kushwaha GitHub',
  'Utkarsh Kushwaha Software Engineer',
  'Backend Developer',
  'Django Developer',
  'FastAPI Developer',
  'AI ML Developer',
  'Next.js Developer',
  'Jabalpur Software Engineer',
]

type PageMetaInput = {
  title: string
  description: string
  /** path relative to the site root, e.g. '/' or '/about' */
  path: string
  keywords?: string[]
}

/**
 * Build consistent per-page metadata (canonical, OG, Twitter). OG/Twitter images
 * come from the route's opengraph-image/twitter-image file conventions, so they
 * are not duplicated here.
 */
export function pageMeta({ title, description, path, keywords }: PageMetaInput): Metadata {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path}`
  return {
    title,
    description,
    keywords: keywords ?? DEFAULT_KEYWORDS,
    alternates: {
      canonical: path,
      languages: { 'en-IN': path, 'x-default': path },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url,
      title,
      description,
      locale: LOCALE,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: PERSON.twitterHandle,
      site: PERSON.twitterHandle,
    },
  }
}
