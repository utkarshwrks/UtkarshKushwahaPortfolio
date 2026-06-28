import { ImageResponse } from 'next/og'

/** Shared 1200×630 social card generator — branded, terminal aesthetic. */
export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export function renderOgImage(title: string, subtitle: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'radial-gradient(120% 120% at 20% 0%, #0c1714 0%, #05070a 60%)',
          padding: '72px',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', color: '#22ff99', fontSize: 30 }}>
          <span style={{ color: '#22ff99' }}>$</span>
          <span style={{ color: '#e9f1ed', marginLeft: 16 }}>utkarsh</span>
          <span style={{ color: '#22ff99', marginLeft: 12 }}>--dev</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#f3f6f5', fontSize: 78, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {title}
          </div>
          <div style={{ color: '#6ee7b7', fontSize: 36, marginTop: 18 }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28, color: '#8aa39a', fontSize: 26 }}>
          <span>GitHub</span>
          <span>·</span>
          <span>LinkedIn</span>
          <span>·</span>
          <span>LeetCode</span>
          <span>·</span>
          <span>Codeforces</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}
