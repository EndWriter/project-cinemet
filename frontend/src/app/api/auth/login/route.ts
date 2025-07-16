import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    //appel vers le backend Django
    const response = await fetch(`${process.env.BACKEND_URL}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
        nextResponse.headers.set('Set-Cookie', setCookieHeader)
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