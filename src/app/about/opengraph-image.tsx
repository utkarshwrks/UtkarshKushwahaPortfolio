import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'About Utkarsh Kushwaha — Software Engineer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage('About Utkarsh Kushwaha', 'Backend & AI Developer · GGITS, Jabalpur')
}
