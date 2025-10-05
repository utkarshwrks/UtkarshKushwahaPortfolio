import './globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/Navbar/Navbar'
import Loader from '@/components/Loader/Loader'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utkarsh Kushwaha | Full Stack Developer & AI Enthusiast',
  description:
    'Portfolio of Utkarsh Kushwaha — Full Stack Developer skilled in Next.js, Django, Flask, and AI integration. Explore my projects, experience, and connect via LinkedIn or GitHub.',
  keywords: [
    'Utkarsh Kushwaha',
    'Full Stack Developer',
    'Backend Developer',
    'AI Enthusiast',
    'Next.js Developer',
    'Python Django Flask',
    'Web Developer Portfolio',
    'GitHub Utkarsh-246',
    'LinkedIn Utkarsh Kushwaha',
  ],
  authors: [{ name: 'Utkarsh Kushwaha', url: 'https://utkarsh-kushwaha.vercel.app/' }],
  creator: 'Utkarsh Kushwaha',
  publisher: 'Utkarsh Kushwaha',
  alternates: {
    canonical: 'https://utkarsh-kushwaha.vercel.app/',
  },
  openGraph: {
    title: 'Utkarsh Kushwaha | Full Stack Developer',
    description:
      'Full Stack Developer & AI Enthusiast — building scalable web apps with modern technologies. Check out my portfolio, GitHub, and LinkedIn.',
    url: 'https://utkarsh-kushwaha.vercel.app/',
    siteName: 'Utkarsh Kushwaha Portfolio',
    images: [
      {
        url: 'https://utkarsh-kushwaha.vercel.app/preview.png',
        width: 1200,
        height: 630,
        alt: 'Utkarsh Kushwaha Portfolio',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utkarsh Kushwaha | Full Stack Developer',
    description:
      'Full Stack Developer | AI Enthusiast | Explore my portfolio, skills, and projects.',
    creator: '@utkarshkushwaha',
    images: ['https://utkarsh-kushwaha.vercel.app/preview.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />

        {/* --- JSON-LD Structured Data --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Utkarsh Kushwaha',
              url: 'https://utkarsh-kushwaha.vercel.app/',
              sameAs: [
                'https://www.linkedin.com/in/utkarshwrks',
                'https://github.com/utkarshwrks',
                'https://x.com/utkarshwrks',
                'https://www.instagram.com/_.utkrashh._', // replace with real handle if any
              ],
              jobTitle: 'Full Stack Developer & AI Enthusiast',
              worksFor: {
                '@type': 'Organization',
                name: 'Team Vasiliades / AIAlchemist',
              },
              alumniOf: {
                '@type': 'CollegeOrUniversity',
                name: 'RGPV University',
              },
              image: 'https://utkarsh-kushwaha.vercel.app/preview.jpg',
              description:
                'Utkarsh Kushwaha — Full Stack Developer skilled in Next.js, Django, and AI integration. Check out my portfolio, GitHub, and LinkedIn.',
            }),
          }}
        />
      </head>

      <body className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="light">
          <Loader />
          <Navbar />
          <main className="pt-16">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
