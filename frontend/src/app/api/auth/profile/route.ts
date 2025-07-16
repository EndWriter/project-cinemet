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
