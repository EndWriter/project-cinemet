import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = params.id

    // Appel vers le backend Django
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/users/${userId}/`, {
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
    console.error('Erreur API user detail:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id
    const body = await request.json()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${sessionCookie.value}`,
    }
    if (csrfCookie) {
      headers['Cookie'] += `; csrftoken=${csrfCookie.value}`
      headers['X-CSRFToken'] = csrfCookie.value
    }

    // Modification utilisateur
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/users/${userId}/`, {
      method: 'PUT',
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
    console.error('Erreur modification utilisateur:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Récup les cookies de la session
    const sessionCookie = request.cookies.get('sessionid')
    const csrfCookie = request.cookies.get('csrftoken')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { message: 'Non authentifié' },
        { status: 401 }
      )
    }

    const userId = params.id
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${sessionCookie.value}`,
    }
    if (csrfCookie) {
      headers['Cookie'] += `; csrftoken=${csrfCookie.value}`
      headers['X-CSRFToken'] = csrfCookie.value
    }

    // Supprimer
    const response = await fetch(`${process.env.BACKEND_URL}/api/admin/users/${userId}/`, {
      method: 'DELETE',
      headers,
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }
  } catch (error) {
    console.error('Erreur suppression utilisateur:', error)
    return NextResponse.json(
      { message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
