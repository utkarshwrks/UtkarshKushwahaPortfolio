import { NextResponse } from 'next/server'
import { checkPassword, setSessionCookie } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let password = ''
  try {
    const body = await req.json()
    password = String(body?.password ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  await setSessionCookie()
  return NextResponse.json({ ok: true })
}
