import type { Metadata } from 'next'
import About from '@/components/About/About'
import AboutFaq from '@/components/About/AboutFaq'
import Footer from '@/components/Footer/Footer'
import { JsonLd, breadcrumb, faqPage } from '@/components/seo/JsonLd'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  title: 'About Utkarsh Kushwaha — Software Engineer & Backend Developer',
  description:
    'About Utkarsh Kushwaha — a Software Engineer and Backend Developer from Jabalpur, India, studying B.Tech CSE (AI & ML) at GGITS. Skilled in Django, FastAPI, Python, AI/ML and DSA (400+ problems solved).',
  path: '/about',
})

// Visible Q&A on the page — kept in sync with the FAQPage schema below (Google
// requires the structured FAQ to match what users actually see).
const FAQ = [
  {
    q: 'Who is Utkarsh Kushwaha?',
    a: 'Utkarsh Kushwaha is a Software Engineer and Backend Developer from Jabalpur, India, specializing in Django, FastAPI, AI/ML and scalable web applications.',
  },
  {
    q: 'Where does Utkarsh Kushwaha study?',
    a: 'Utkarsh is pursuing a B.Tech in Computer Science & Engineering (AI & ML) at Gyan Ganga Institute of Technology and Science (GGITS), Jabalpur.',
  },
  {
    q: 'What technologies does Utkarsh Kushwaha work with?',
    a: 'He works primarily with Python, Django, FastAPI, Flask, JavaScript/TypeScript, Next.js and Node.js, and integrates AI/ML into real-world products. He has solved 400+ DSA problems across LeetCode and Codeforces.',
  },
  {
    q: 'Where can I find Utkarsh Kushwaha online?',
    a: 'On GitHub (@utkarshwrks), LinkedIn (utkarshwrks), LeetCode (utkarsh-246), Codeforces (utkarsh246) and X (@utkarshwrks).',
  },
]

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
      <JsonLd data={faqPage(FAQ)} />

      {/* the page's single H1 (visually hidden — the section provides the visible heading) */}
      <h1 className="sr-only">About Utkarsh Kushwaha — Software Engineer &amp; Backend Developer</h1>

      <About />
      <AboutFaq items={FAQ} />
      <Footer />
    </>
  )
}
