import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    const csrfCookie = request.cookies.get('csrftoken')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer formulaire
    const body = await request.json()

    // Cookies
    let cookieHeader = `sessionid=${sessionCookie.value}`
    if (csrfCookie) {
      cookieHeader += `; csrftoken=${csrfCookie.value}`
    }

    // Appel backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/contact/`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfCookie?.value || '',
      },
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorData = await response.json()
      console.error('Backend error:', response.status, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
