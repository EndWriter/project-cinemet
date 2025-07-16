import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes qui nécessitent une authentification
const protectedRoutes = ['/home', '/profile', '/contact', '/admin']
// Routes publiques (autobhan)
const publicRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
  
  // Vérifier si l'utilisateur a un cookie de session
  const sessionCookie = request.cookies.get('sessionid')?.value
  
  // Rediriger vers la page de connexion  si non connecté 
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }
  
  // Rediriger vers /home si on est connecté et qu'on essaie d'accéder à login
  if (isPublicRoute && sessionCookie && path !== '/') {
    return NextResponse.redirect(new URL('/home', request.nextUrl))
  }
  
  return NextResponse.next()
}

//
// Configuration du middleware
//
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
