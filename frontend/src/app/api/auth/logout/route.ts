import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // récupérer les cookies de session
    const sessionCookie = request.cookies.get('sessionid')
    
    // Créer la réponse de déconnexion
    const nextResponse = NextResponse.json({ message: 'Déconnexion réussie' })
    
    // Supprimer TOUS les cookies d'authentification
    const cookiesToDelete = ['sessionid', 'csrftoken']
    
    cookiesToDelete.forEach(cookieName => {
      nextResponse.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0, // expire immédiatement 
        path: '/'
      })
    })

    // Si on a un cookie de session, essayer de déconnecter côté serveur
    if (sessionCookie) {
      try {
        await fetch(`${process.env.BACKEND_URL}/api/logout/`, {
          method: 'POST',
          headers: {
            'Cookie': `sessionid=${sessionCookie.value}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (backendError) {
        // Même si le backend échoue, on continue avec la déconnexion côté client
        console.error('Erreur backend lors de la déconnexion:', backendError)
      }
    }

    return nextResponse
  } catch (error) {
    // Même en cas d'erreur, supprimer tous les cookies côté client
    const nextResponse = NextResponse.json({ message: 'Déconnexion effectuée' })
    
    const cookiesToDelete = ['sessionid', 'csrftoken']
    cookiesToDelete.forEach(cookieName => {
      nextResponse.cookies.set(cookieName, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
      })
    })
    
    return nextResponse
  }
}
