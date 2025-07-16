import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Appel backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/profile/`, {
      method: 'GET',
      headers: {
        'Cookie': `sessionid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ user: data })
    } else {
      return NextResponse.json(
        { message: 'Erreur lors de la récupération du profil' },
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

export async function PUT(request: NextRequest) {
  try {
    // récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    // récupérer le token afin de pouvoir modifier par le profil user
    const csrfCookie = request.cookies.get('csrftoken')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Préparer les headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${sessionCookie.value}`,
    }

    // Ajouter le token CSRF si disponible
    if (csrfCookie) {
      headers['Cookie'] += `; csrftoken=${csrfCookie.value}`
      headers['X-CSRFToken'] = csrfCookie.value
    }

    // Appel vers le backend Django pour mettre à jour le profil
    const response = await fetch(`${process.env.BACKEND_URL}/api/profile/`, {
      method: 'PATCH', // Utiliser PATCH au lieu de PUT pour modifier le profil user
      headers,
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ user: data.user || data })
    } else {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
