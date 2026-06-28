import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { commitBase64 } from '@/lib/github-cms'

export const runtime = 'nodejs'

// POST /api/admin/resume  { dataUrl }
// Overwrites public/resume.pdf so every existing "/resume.pdf" link updates.
export async function POST(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let dataUrl = ''
  try {
    const body = await req.json()
    dataUrl = String(body?.dataUrl ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const match = /^data:application\/pdf;base64,(.+)$/.exec(dataUrl)
  if (!match) {
    return NextResponse.json({ error: 'Please upload a PDF file.' }, { status: 400 })
  }

  try {
    await commitBase64('public/resume.pdf', match[1], 'chore(resume): update resume.pdf via admin panel')
    return NextResponse.json({ ok: true, path: '/resume.pdf' })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
