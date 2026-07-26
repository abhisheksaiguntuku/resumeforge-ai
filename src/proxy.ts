import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password']
const AUTH_ROUTES = ['/login', '/signup', '/forgot-password']

export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!(req as { auth: { user?: unknown } & unknown }).auth?.user

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route)
  const isAuthRoute = AUTH_ROUTES.some(route => pathname === route)
  const isApiRoute = pathname.startsWith('/api')
  const isStaticFile = pathname.startsWith('/_next') || pathname.startsWith('/favicon')

  if (isApiRoute || isStaticFile) return NextResponse.next()

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Protect dashboard routes
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
