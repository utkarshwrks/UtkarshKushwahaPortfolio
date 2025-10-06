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
        alt: 'Utkarsh Kushwaha Portfolio Preview',
      },
      {
        url: 'https://utkarsh-kushwaha.vercel.app/logoo.png',
        width: 512,
        height: 512,
        alt: 'Utkarsh Logo',
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
    creator: '@utkarshwrks',
    images: [
      'https://utkarsh-kushwaha.vercel.app/preview.png',
      'https://utkarsh-kushwaha.vercel.app/logoo.png',
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="PzKFfW7jHV_W8o_xQ0j5kbcZDtIlGsqTd_dMbgmyo68"
        />

        {/* ✅ Favicon & Theme */}
        <link rel="icon" href="/logoo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="shortcut icon" href="/logo.png" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* ✅ Performance & Compatibility */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />

        {/* ✅ JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              '@id': 'https://utkarsh-kushwaha.vercel.app/#person',
              name: 'Utkarsh Kushwaha',
              url: 'https://utkarsh-kushwaha.vercel.app/',
              sameAs: [
                'https://www.linkedin.com/in/utkarshwrks',
                'https://github.com/utkarshwrks',
                'https://x.com/utkarshwrks',
                'https://www.instagram.com/_.utkrashh._',
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
              image: [
                'https://utkarsh-kushwaha.vercel.app/preview.png',
                'https://utkarsh-kushwaha.vercel.app/logo.png',
              ],
              description:
                'Utkarsh Kushwaha — Full Stack Developer skilled in Next.js, Django, and AI integration. Explore my portfolio, GitHub, and LinkedIn.',
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
