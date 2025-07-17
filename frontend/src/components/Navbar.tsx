'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface User {
  role?: {
    role: string
  }
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Toujours déconnecter côté client, même si le serveur a une erreur
      setUser(null)
      
      // Forcer la suppression des cookies côté client aussi
      document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Même en cas d'erreur, déconnecter côté client
      setUser(null)
      
      // Forcer la suppression des cookies côté client
      document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      router.push('/login')
    }
  }

  if (isLoading) {
    return (
      <nav className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-white text-xl font-bold">Cinemet</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="animate-pulse bg-indigo-500 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/home" className="text-white text-xl font-bold hover:text-indigo-200 transition-colors">
              Cinemet
            </Link>
          </div>

          {/* navigation links */}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link 
                href="/home" 
                className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Accueil
              </Link>
              
              <Link 
                href="/profile" 
                className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Profil
              </Link>
              
              <Link 
                href="/contact" 
                className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>

              {/*seulement si l'utilisateur est admin */}
              {user.role?.role === 'admin' && (
                <Link 
                  href="/admin" 
                  className="bg-indigo-500 text-white hover:bg-indigo-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin
                </Link>
              )}

              {/* Bouton de déconnexion */}
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                href="/login" 
                className="text-white hover:text-indigo-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Connexion
              </Link>
              
              <Link 
                href="/register" 
                className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
