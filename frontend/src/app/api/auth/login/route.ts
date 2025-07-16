import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    // d'abord obtenir le token CSRF
    const csrfResponse = await fetch(`${process.env.BACKEND_URL}/api/csrf/`, {
      method: 'GET',
    })
    
    let csrfToken = ''
    let csrfCookie = ''
    
    if (csrfResponse.ok) {
      const csrfData = await csrfResponse.json()
      csrfToken = csrfData.csrfToken
      
      const setCsrfCookie = csrfResponse.headers.get('set-cookie')
      if (setCsrfCookie) {
        const match = setCsrfCookie.match(/csrftoken=([^;]+)/)
        if (match) {
          csrfCookie = match[1]
        }
      }
    }

    //appel vers le backend Django
    const response = await fetch(`${process.env.BACKEND_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Cookie': `csrftoken=${csrfCookie}`,
      },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json()
      
      // Récupérer les cookies de session du backend
      const setCookieHeader = response.headers.get('set-cookie')
      const nextResponse = NextResponse.json(data)
      
      if (setCookieHeader) {
        // Transférer le cookie de session au frontend
        const cookies = setCookieHeader.split(',').map(cookie => cookie.trim())
        cookies.forEach(cookie => {
          nextResponse.headers.append('Set-Cookie', cookie)
        })
      }
      if (csrfCookie) {
        nextResponse.headers.append('Set-Cookie', `csrftoken=${csrfCookie}; Path=/; SameSite=Lax`)
      }
      
      return nextResponse
    } else {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || 'Erreur de connexion' },
        { status: response.status }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}