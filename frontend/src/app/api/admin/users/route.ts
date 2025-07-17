import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les paramètres
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'
    const search = searchParams.get('search') || ''

    // Construire l'URL
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    })

    // Appel vers le backend Django
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/users/?${params}`, {
      method: 'GET',
      headers: {
        'Cookie': `sessionid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    console.error('Erreur API admin users:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

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

    const body = await request.json()

    // Préparer les headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${sessionCookie.value}`,
    }
    if (csrfCookie) {
      headers['Cookie'] += `; csrftoken=${csrfCookie.value}`
      headers['X-CSRFToken'] = csrfCookie.value
    }

    // Créer
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/users/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    console.error('Erreur création utilisateur:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
