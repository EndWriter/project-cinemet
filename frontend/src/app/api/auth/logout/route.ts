import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Appel vers le backend pour déconnexion
    const response = await fetch(`${process.env.BACKEND_URL}/api/logout/`, {
      method: 'POST',
      headers: {
        'Cookie': `sessionid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
    })

    // Créer la réponse (lors de la déco)
    const nextResponse = NextResponse.json({ message: 'Déconnexion réussie' })
    
    // Supprimer le cookie sessionid
    nextResponse.cookies.set('sessionid', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // expire immediat 
      path: '/'
    })

    return nextResponse
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
