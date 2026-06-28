import './globals.css'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar/Navbar'
import Loader from '@/components/Loader/Loader'
import ChatWidget from '@/components/Chat/ChatWidget'
import DynamicBackground from '@/components/Background/DynamicBackground'
import { SiteJsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, SITE_NAME, LOCALE, PERSON, DEFAULT_KEYWORDS } from '@/lib/seo'
import type { Metadata, Viewport } from 'next'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })

const HOME_TITLE = 'Utkarsh Kushwaha — Software Engineer | Backend & AI Developer'
const HOME_DESC =
  'Utkarsh Kushwaha — Software Engineer and Backend Developer specializing in Django, FastAPI, AI/ML and scalable web apps. Explore his portfolio, projects, GitHub, LeetCode and Codeforces.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: '%s · Utkarsh Kushwaha',
  },
  description: HOME_DESC,
  applicationName: SITE_NAME,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: PERSON.name, url: SITE_URL }],
  creator: PERSON.name,
  publisher: PERSON.name,
  category: 'technology',
  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/', 'x-default': '/' },
  },
  openGraph: {
    type: 'profile',
    siteName: SITE_NAME,
    url: SITE_URL,
    title: HOME_TITLE,
    description: HOME_DESC,
    locale: LOCALE,
    firstName: 'Utkarsh',
    lastName: 'Kushwaha',
    username: 'utkarshwrks',
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESC,
    creator: PERSON.twitterHandle,
    site: PERSON.twitterHandle,
  },
  // favicon/apple-icon come from app/icon.png + app/apple-icon.png; the web app
  // manifest comes from app/manifest.ts — all auto-injected by Next.
  verification: { google: 'j-CdA2exKI_5a0knLXKPmPLAJrp-YpfO46mqJMtS6Ls' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#05070a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-content antialiased">
        <SiteJsonLd />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <DynamicBackground />
          <div data-site-chrome>
            <Loader />
            <Navbar />
          </div>
          <main className="pt-16">{children}</main>
          <div data-site-chrome>
            <ChatWidget />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
