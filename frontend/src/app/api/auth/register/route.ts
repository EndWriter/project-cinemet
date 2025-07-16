import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const body = await request.json()

    // Appel backend pour l'inscription
    const response = await fetch(`${process.env.BACKEND_URL}/api/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
