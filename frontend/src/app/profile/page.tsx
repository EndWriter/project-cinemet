'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Heart, Bookmark, Star, User, Mail, Calendar, Edit2, Trash2 } from 'lucide-react'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  date_joined: string
  role: {
    role: string
  }
}

interface Movie {
  id_film: number
  title: string
  release_date: string
  main_image?: {
    id: number
    name: string
    url: string
    is_main: boolean
    created_at: string
  }
  average_rating?: number
}

interface FavoriteItem {
  id: number
  movie: Movie
  created_at: string
}

interface WatchlistItem {
  id: number
  movie: Movie
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'favorites' | 'watchlist'>('favorites')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: ''
  })

  useEffect(() => {
    loadUserProfile()
    loadFavorites()
    loadWatchlist()
  }, [])

  const loadUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/profile')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        setEditForm({
          first_name: data.user.first_name || '',
          last_name: data.user.last_name || '',
          email: data.user.email
        })
      } else {
        router.push('/login')
      }
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        // Adapte le format
        if (data.results && Array.isArray(data.results)) {
          setFavorites(data.results)
        } else if (Array.isArray(data)) {
          setFavorites(data)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error)
    }
  }

  const loadWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist')
      if (response.ok) {
        const data = await response.json()
        // Si c'est un format paginé, prendre les results
        if (data.results && Array.isArray(data.results)) {
          setWatchlist(data.results)
        } else if (Array.isArray(data)) {
          setWatchlist(data)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la watchlist:', error)
    }
  }

  const removeFavorite = async (movieId: number) => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieId }),
      })
      
      if (response.ok) {
        loadFavorites() // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error)
    }
  }

  const removeFromWatchlist = async (movieId: number) => {
    try {
      const response = await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieId }),
      })
      
      if (response.ok) {
        loadWatchlist() // Recharger la liste
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la watchlist:', error)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        setEditMode(false)
        loadUserProfile()
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400 py-12">
            <h2 className="text-2xl font-bold mb-4">Erreur de chargement du profil</h2>
            <button
              onClick={() => router.push('/home')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* En tête du profil */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  {editMode ? (
                    <form onSubmit={updateProfile} className="space-y-3">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="Prénom"
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                          className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Nom"
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                          className="px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <input
                        type="email"
                        placeholder="Email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        className="w-full px-3 py-1 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                        >
                          Sauvegarder
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="px-4 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-white mb-2">
                        {user.first_name && user.last_name 
                          ? `${user.first_name} ${user.last_name}` 
                          : 'Utilisateur'}
                      </h1>
                      <div className="flex items-center gap-2 text-gray-300 mb-1">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>Membre depuis {new Date(user.date_joined).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {user.role && (
                        <div className="mt-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role.role === 'admin' 
                              ? 'bg-red-600 text-white' 
                              : 'bg-blue-600 text-white'
                          }`}>
                            {user.role.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              Mes Favoris ({favorites.length})
            </button>
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md transition-colors ${
                activeTab === 'watchlist'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              Ma Watchlist ({watchlist.length})
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="space-y-4">
            {activeTab === 'favorites' && (
              <div>
                {favorites.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-medium mb-2">Aucun favori</h3>
                    <p>Ajoutez des films à vos favoris pour les retrouver ici</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="flex">
                          <div className="w-24 h-36 bg-gray-700 flex-shrink-0">
                            {favorite.movie.main_image?.url ? (
                              <img
                                src={favorite.movie.main_image.url}
                                alt={favorite.movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                🎬
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4">
                            <h3 className="font-bold text-white mb-2 line-clamp-2">
                              {favorite.movie.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">
                              {new Date(favorite.movie.release_date).getFullYear()}
                            </p>
                            {favorite.movie.average_rating && (
                              <div className="flex items-center gap-1 mb-3">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-white">
                                  {favorite.movie.average_rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => router.push(`/movies/${favorite.movie.id_film}`)}
                                className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Voir
                              </button>
                              <button
                                onClick={() => removeFavorite(favorite.movie.id_film)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'watchlist' && (
              <div>
                {watchlist.length === 0 ? (
                  <div className="text-center text-gray-400 py-12">
                    <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                    <h3 className="text-xl font-medium mb-2">Watchlist vide</h3>
                    <p>Ajoutez des films à votre watchlist pour les regarder plus tard</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {watchlist.map((item) => (
                      <div key={item.id} className="bg-gray-800 rounded-lg overflow-hidden">
                        <div className="flex">
                          <div className="w-24 h-36 bg-gray-700 flex-shrink-0">
                            {item.movie.main_image?.url ? (
                              <img
                                src={item.movie.main_image.url}
                                alt={item.movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                🎬
                              </div>
                            )}
                          </div>
                          <div className="flex-1 p-4">
                            <h3 className="font-bold text-white mb-2 line-clamp-2">
                              {item.movie.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-2">
                              {new Date(item.movie.release_date).getFullYear()}
                            </p>
                            {item.movie.average_rating && (
                              <div className="flex items-center gap-1 mb-3">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-white">
                                  {item.movie.average_rating.toFixed(1)}
                                </span>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => router.push(`/movies/${item.movie.id_film}`)}
                                className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Voir
                              </button>
                              <button
                                onClick={() => removeFromWatchlist(item.movie.id_film)}
                                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
