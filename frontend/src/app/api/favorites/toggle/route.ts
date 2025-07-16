import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer requête
    const body = await request.json()

    // Appel backend
    const response = await fetch(`${process.env.BACKEND_URL}/api/favorites/toggle/`, {
      method: 'POST',
      headers: {
        'Cookie': `sessionid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
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
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
