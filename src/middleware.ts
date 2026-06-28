import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Hides the admin panel behind a secret URL.
 *
 * Set ADMIN_PATH in your env (e.g. ADMIN_PATH=panel-3f9a2c). Then:
 *   • /<ADMIN_PATH>   → internally serves the admin panel (URL stays secret)
 *   • /admin          → 404 (the obvious URL reveals nothing)
 *
 * ADMIN_PATH is a server-only env var, so the secret never ships in the client
 * bundle. If ADMIN_PATH is unset, the panel stays at /admin (handy for local dev).
 * /api/admin/* is never touched here — login/session keep working as before.
 */
export function middleware(req: NextRequest) {
  const secret = process.env.ADMIN_PATH?.trim()
  const { pathname } = req.nextUrl

  if (!secret) return NextResponse.next()

  // secret URL → serve the real admin route internally (browser URL unchanged)
  if (pathname === `/${secret}` || pathname === `/${secret}/`) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.rewrite(url)
  }

  // the obvious /admin path is hidden once a secret is configured
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.next()
}

export const config = {
  // run on pages only — skip Next internals, the API (incl. /api/admin), and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/|.*\\.[\\w]+$).*)'],
}
