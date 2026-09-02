import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Check if the route is protected before doing an expensive auth call
    const protectedPaths = ['/account']
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
    const isProtectedPath = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    )

    // Only do network auth lookup if path actually requires authentication
    if (isProtectedPath || isAdminPath) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (isProtectedPath && !user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        url.searchParams.set('redirect', request.nextUrl.pathname)
        return NextResponse.redirect(url)
      }

      if (isAdminPath) {
        if (request.nextUrl.pathname === '/admin/login') {
          return supabaseResponse
        }

        const hasAdminCookie = request.cookies.get('admin_session')?.value === 'authenticated'
        if (!user && !hasAdminCookie) {
          const url = request.nextUrl.clone()
          url.pathname = '/admin/login'
          return NextResponse.redirect(url)
        }
      }
    }
  } catch (err) {
    console.warn('Supabase middleware bypass:', err)
  }

  return supabaseResponse
}
