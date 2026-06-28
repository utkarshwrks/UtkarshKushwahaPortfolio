import { SITE_URL, SITE_NAME, PERSON } from '@/lib/seo'

/** Renders one or more JSON-LD nodes as a single <script>. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const personNode = {
  '@type': 'Person',
  '@id': `${SITE_URL}/#person`,
  name: PERSON.name,
  alternateName: PERSON.alternateName,
  url: SITE_URL,
  image: { '@type': 'ImageObject', url: PERSON.image },
  jobTitle: PERSON.jobTitle,
  description: PERSON.description,
  email: `mailto:${PERSON.email}`,
  knowsAbout: PERSON.knowsAbout,
  sameAs: PERSON.sameAs,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: PERSON.alumniOf.name,
    url: PERSON.alumniOf.url,
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: PERSON.location.city,
    addressRegion: PERSON.location.region,
    addressCountry: PERSON.location.country,
  },
  nationality: { '@type': 'Country', name: 'India' },
}

const websiteNode = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: PERSON.description,
  inLanguage: 'en',
  publisher: { '@id': `${SITE_URL}/#person` },
}

const profilePageNode = {
  '@type': 'ProfilePage',
  '@id': `${SITE_URL}/#profilepage`,
  url: SITE_URL,
  name: `${PERSON.name} — ${PERSON.jobTitle}`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#person` },
  mainEntity: { '@id': `${SITE_URL}/#person` },
  inLanguage: 'en',
}

/** Site-wide identity graph — placed once in the root layout. */
export function SiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [personNode, websiteNode, profilePageNode],
      }}
    />
  )
}

/** Breadcrumb trail for a page, e.g. Home › About. */
export function breadcrumb(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === '/' ? '' : it.path}`,
    })),
  }
}

/** FAQPage schema — only use when the same Q&A is visible on the page. */
export function faqPage(qa: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qa.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}
