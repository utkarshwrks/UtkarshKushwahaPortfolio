import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const runtime = 'edge'
export const alt = 'Utkarsh Kushwaha — Software Engineer · Backend & AI Developer'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage('Utkarsh Kushwaha', 'Software Engineer · Backend & AI Developer')
}
