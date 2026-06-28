import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { COLLECTIONS, isCollectionKey } from '@/lib/content-config'
import { readJson, writeJson } from '@/lib/github-cms'

export const runtime = 'nodejs'

// GET /api/admin/content?type=projects  -> current items from the repo
export async function GET(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const type = new URL(req.url).searchParams.get('type')
  if (!isCollectionKey(type)) {
    return NextResponse.json({ error: 'Unknown collection' }, { status: 400 })
  }

  try {
    const items = await readJson(COLLECTIONS[type].path)
    return NextResponse.json({ items })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// PUT /api/admin/content  { type, items }  -> commit whole array back to repo
export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let type: unknown
  let items: unknown
  try {
    const body = await req.json()
    type = body?.type
    items = body?.items
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!isCollectionKey(type)) {
    return NextResponse.json({ error: 'Unknown collection' }, { status: 400 })
  }
  if (!Array.isArray(items)) {
    return NextResponse.json({ error: 'items must be an array' }, { status: 400 })
  }

  try {
    await writeJson(
      COLLECTIONS[type].path,
      items,
      `chore(content): update ${type} via admin panel`
    )
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
