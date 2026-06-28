import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { commitBase64 } from '@/lib/github-cms'

export const runtime = 'nodejs'

// POST /api/admin/upload  { filename, dataUrl }
// Commits an image into /public and returns its public path (e.g. "/my-pic.jpg").
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let filename = ''
  let dataUrl = ''
  try {
    const body = await req.json()
    filename = String(body?.filename ?? '')
    dataUrl = String(body?.dataUrl ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // dataUrl looks like: data:image/jpeg;base64,XXXX
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl)
  if (!match) {
    return NextResponse.json({ error: 'Invalid image data' }, { status: 400 })
  }
  const base64 = match[2]

  // sanitize filename -> safe slug, keep extension
  const safe = filename
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  const finalName = safe || 'upload.jpg'
  const repoPath = `public/${finalName}`

  try {
    await commitBase64(repoPath, base64, `chore(media): add ${finalName} via admin panel`)
    return NextResponse.json({ ok: true, path: `/${finalName}` })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
