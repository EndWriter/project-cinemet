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

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams()
    
    // Transférer recherche
    searchParams.forEach((value, key) => {
      params.set(key, value)
    })

    // Appel backend
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/movies/?${params}`,
      {
        method: 'GET',
        headers: {
          'Cookie': `sessionid=${sessionCookie.value}`,
          'Content-Type': 'application/json',
        },
      }
    )

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
