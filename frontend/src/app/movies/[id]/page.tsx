'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Heart, Bookmark, Star, Calendar, Clock, User, Users } from 'lucide-react'

interface Movie {
  id_film: number
  title: string
  description: string
  release_date: string
  duration: number
  url_trailer?: string
  average_rating?: number
  created_at: string
  updated_at: string
  genres: Array<{
    id: number
    genre: string
    created_at: string
  }>
  directors: Array<{
    id: number
    firstname: string
    lastname: string
    full_name: string
  }>
  actors: Array<{
    id: number
    firstname: string
    lastname: string
    full_name: string
  }>
  images: Array<{
    id: number
    name: string
    url: string
    is_main: boolean
    created_at: string
  }>
}

interface UserRating {
  rating: number
  comment: string
}

export default function MovieDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [userRating, setUserRating] = useState<UserRating | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRatingForm, setShowRatingForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)

  useEffect(() => {
    loadMovieDetails()
    loadUserRating()
    loadFavoriteStatus()
    loadWatchlistStatus()
  }, [params.id])

  const loadMovieDetails = async () => {
    try {
      const response = await fetch(`/api/movies/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setMovie(data)
      } else if (response.status === 404) {
        setError('Film non trouvé')
      } else {
        setError('Erreur lors du chargement du film')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const loadUserRating = async () => {
    try {
      const response = await fetch(`/api/movies/${params.id}/rating`)
      if (response.ok) {
        const data = await response.json()
        setUserRating(data)
        setRating(data.rating)
        setComment(data.comment || '')
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la note:', error)
    }
  }

  const loadFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/movies/${params.id}/favorite`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.is_favorite)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du statut favoris:', error)
    }
  }

  const loadWatchlistStatus = async () => {
    try {
      const response = await fetch(`/api/movies/${params.id}/watchlist`)
      if (response.ok) {
        const data = await response.json()
        setIsInWatchlist(data.is_in_watchlist)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du statut watchlist:', error)
    }
  }

  const submitRating = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/movies/${params.id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }),
      })

      if (response.ok) {
        setShowRatingForm(false)
        loadMovieDetails() // Recharger pour mettre à jour la note moyenne
        loadUserRating()
      } else {
        setError('Erreur lors de la soumission de la note')
      }
    } catch (error) {
      setError('Erreur de connexion')
    }
  }

  const toggleFavorite = async () => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movie?.id_film }),
      })
      
      if (response.ok) {
        setIsFavorite(!isFavorite)
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error)
    }
  }

  const toggleWatchlist = async () => {
    try {
      const response = await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movie?.id_film }),
      })
      
      if (response.ok) {
        setIsInWatchlist(!isInWatchlist)
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la watchlist:', error)
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

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400 py-12">
            <h2 className="text-2xl font-bold mb-4">{error || 'Film non trouvé'}</h2>
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

  const mainImage = movie.images.find(img => img.is_main) || movie.images[0]

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => router.back()}
          className="mb-6 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image principale */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              {mainImage ? (
                <img
                  src={mainImage.url}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-[2/3] flex items-center justify-center bg-gray-700">
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <div>Pas d'image</div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="mt-4 space-y-3">
              <button
                onClick={toggleFavorite}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isFavorite
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>

              <button
                onClick={toggleWatchlist}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  isInWatchlist
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
                {isInWatchlist ? 'Retirer de la watchlist' : 'Ajouter à la watchlist'}
              </button>

              <button
                onClick={() => setShowRatingForm(!showRatingForm)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
              >
                <Star className="w-5 h-5" />
                {userRating ? 'Modifier ma note' : 'Noter ce film'}
              </button>
            </div>
          </div>

          {/* Informations détaillées */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-4">{movie.title}</h1>

            {/* Note moyenne */}
            {movie.average_rating && (
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className="text-2xl font-bold text-white">
                  {movie.average_rating.toFixed(1)}
                </span>
                <span className="text-gray-400">/10</span>
              </div>
            )}

            {/* Informations de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar className="w-5 h-5" />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5" />
                <span>{movie.duration} minutes</span>
              </div>
            </div>

            {/* Genres */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
                  >
                    {genre.genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Synopsis</h3>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>

            {/* Réalisateurs */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <User className="w-5 h-5" />
                Réalisateur{movie.directors.length > 1 ? 's' : ''}
              </h3>
              <div className="flex flex-wrap gap-2">
                {movie.directors.map((director) => (
                  <span
                    key={director.id}
                    className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg"
                  >
                    {director.full_name}
                  </span>
                ))}
              </div>
            </div>

            {/* Acteurs */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Acteurs principaux
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {movie.actors.slice(0, 9).map((actor) => (
                  <span
                    key={actor.id}
                    className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-lg text-center"
                  >
                    {actor.full_name}
                  </span>
                ))}
                {movie.actors.length > 9 && (
                  <span className="px-3 py-1 bg-gray-600 text-gray-400 text-sm rounded-lg text-center">
                    +{movie.actors.length - 9} autres
                  </span>
                )}
              </div>
            </div>

            {/* Bande-annonce */}
            {movie.url_trailer && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Bande-annonce</h3>
                <a
                  href={movie.url_trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  🎥 Voir la bande-annonce
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Formulaire de notation */}
        {showRatingForm && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {userRating ? 'Modifier ma note' : 'Noter ce film'}
            </h3>
            
            <form onSubmit={submitRating} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Note (0-10)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(parseFloat(e.target.value))}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Commentaire (optionnel)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Votre avis sur ce film..."
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none h-24 resize-none"
                />
              </div>
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {userRating ? 'Modifier' : 'Valider'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRatingForm(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Note actuelle de l'utilisateur */}
        {userRating && !showRatingForm && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Ma note</h3>
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="text-lg font-bold text-white">{userRating.rating}/10</span>
            </div>
            {userRating.comment && (
              <p className="text-gray-300 italic">"{userRating.comment}"</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
