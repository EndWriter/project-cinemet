import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    const csrfCookie = request.cookies.get('csrftoken')
    
    if (!sessionCookie || !csrfCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const { rating, comment } = await request.json()

    // Appel backend pour noter le film
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/ratings/rate/`,
      {
        method: 'POST',
        headers: {
          'Cookie': `sessionid=${sessionCookie.value}; csrftoken=${csrfCookie.value}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie.value,
        },
        body: JSON.stringify({
          movie_id: id,
          rating,
          comment
        }),
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    const csrfCookie = request.cookies.get('csrftoken')
    
    if (!sessionCookie || !csrfCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Appel backend pour récupérer la note de l'utilisateur
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/ratings/user/?movie_id=${id}`,
      {
        method: 'GET',
        headers: {
          'Cookie': `sessionid=${sessionCookie.value}; csrftoken=${csrfCookie.value}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie.value,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Récupérer cookie de session
    const sessionCookie = request.cookies.get('sessionid')
    const csrfCookie = request.cookies.get('csrftoken')
    
    if (!sessionCookie || !csrfCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Appel back pour supprimer la note
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/ratings/delete/`,
      {
        method: 'POST',
        headers: {
          'Cookie': `sessionid=${sessionCookie.value}; csrftoken=${csrfCookie.value}`,
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfCookie.value,
        },
        body: JSON.stringify({
          movie_id: id
        }),
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
