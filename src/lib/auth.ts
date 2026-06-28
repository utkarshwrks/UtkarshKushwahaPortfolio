import crypto from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_session'
const MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s) throw new Error('ADMIN_SESSION_SECRET is not set')
  return s
}

function sign(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('base64url')
}

/** Create a signed session token: base64url(payload).signature */
export function createToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ role: 'admin', exp: nowSeconds() + MAX_AGE_SECONDS })
  ).toString('base64url')
  return `${payload}.${sign(payload)}`
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000)
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  // timing-safe compare
  const expected = sign(payload)
  if (
    expected.length !== sig.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
  ) {
    return false
  }
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
    return data.role === 'admin' && typeof data.exp === 'number' && data.exp > nowSeconds()
  } catch {
    return false
  }
}

/** Validate the supplied password against ADMIN_PASSWORD (timing-safe). */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) throw new Error('ADMIN_PASSWORD is not set')
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export async function setSessionCookie() {
  const store = await cookies()
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_SECONDS,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

/** True if the current request carries a valid admin session. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies()
  return verifyToken(store.get(COOKIE_NAME)?.value)
}
