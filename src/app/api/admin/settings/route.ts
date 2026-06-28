import { NextResponse } from 'next/server'
import { isAuthed } from '@/lib/auth'
import { readJsonObject, writeJson } from '@/lib/github-cms'
import { SETTINGS_PATH, defaultSettings, type SiteSettings } from '@/lib/site-settings'

export const runtime = 'nodejs'

// GET /api/admin/settings -> current singleton settings object from the repo
export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const settings = await readJsonObject<SiteSettings>(SETTINGS_PATH, defaultSettings)
    return NextResponse.json({ settings })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}

// PUT /api/admin/settings { settings } -> commit the whole object back to the repo
export async function PUT(req: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let settings: unknown
  try {
    settings = (await req.json())?.settings
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  if (!settings || typeof settings !== 'object') {
    return NextResponse.json({ error: 'settings must be an object' }, { status: 400 })
  }

  try {
    await writeJson(SETTINGS_PATH, settings, 'chore(content): update site settings via admin panel')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
