import type { MetadataRoute } from 'next'
import { SITE_NAME, PERSON } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — ${PERSON.jobTitle}`,
    short_name: SITE_NAME,
    description: PERSON.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#05070a',
    theme_color: '#05070a',
    lang: 'en',
    categories: ['portfolio', 'technology', 'developer'],
    icons: [
      { src: '/logoo.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logoo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logoo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
