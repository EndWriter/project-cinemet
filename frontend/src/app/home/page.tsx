'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface Movie {
  id_film: number
  title: string
  description?: string
  release_date: string
  duration?: number
  main_image?: {
    id: number
    name: string
    url: string
    is_main: boolean
    created_at: string
  }
  average_rating?: number
}

interface Genre {
  id: number
  name: string
}

interface ApiResponse {
  count: number
  next?: string
  previous?: string
  results: Movie[]
}

export default function HomePage() {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth()
  }, [])

  // Charger films et genres
  useEffect(() => {
    if (loading) return
    loadMovies()
    loadGenres()
  }, [currentPage, searchTerm, selectedGenre, loading])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/profile')
      if (response.status === 401) {
        router.push('/login')
        return
      }
      setLoading(false)
    } catch (error) {
      router.push('/login')
    }
  }

  const loadMovies = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: '10'
      })
      
      if (searchTerm) params.set('search', searchTerm)
      if (selectedGenre) params.set('genre', selectedGenre)

      const response = await fetch(`/api/movies?${params}`)
      if (response.ok) {
        const data: ApiResponse = await response.json()
        setMovies(data.results)
        setTotalPages(Math.ceil(data.count / 10))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des films:', error)
    }
  }

  const loadGenres = async () => {
    try {
      const response = await fetch('/api/movies/genres')
      if (response.ok) {
        const data = await response.json()
        // Adapter le format de la réponse 
        if (data.results && Array.isArray(data.results)) {
          setGenres(data.results)
        } else if (Array.isArray(data)) {
          setGenres(data)
        } else {
          setGenres([])
        }
      }
    } catch (error) {
      setGenres([])
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    loadMovies()
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
    setCurrentPage(1)
  }

  const toggleFavorite = async (movieId: number) => {
    try {
      const response = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieId }),
      })
      
      if (response.ok) {
        // Recharger la liste pour mettre à jour les statuts
        loadMovies()
      }
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error)
    }
  }

  const toggleWatchlist = async (movieId: number) => {
    try {
      const response = await fetch('/api/watchlist/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movie_id: movieId }),
      })
      
      if (response.ok) {
        // Recharger la liste pour mettre à jour les statuts
        loadMovies()
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la watchlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Cinemet - Catalogue de Films
        </h1>

        {/* Barre de recherche / filtres */}
        <div className="mb-8 bg-gray-800 p-6 rounded-lg">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Rechercher
            </button>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="text-white font-medium">Filtrer par genre:</label>
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Tous les genres</option>
              {Array.isArray(genres) && genres.map((genre) => (
                <option key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des films */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {movies.map((movie) => (
            <div key={movie.id_film} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {/* Image du film */}
              <div className="h-64 bg-gray-700 flex items-center justify-center">
                {movie.main_image?.url ? (
                  <img
                    src={movie.main_image.url}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-4xl mb-2">🎬</div>
                    <div>Pas d'image</div>
                  </div>
                )}
              </div>

              {/* Info du film */}
              <div className="p-4">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {movie.title}
                </h3>
                
                {movie.description && (
                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                    {movie.description}
                  </p>
                )}

                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400 text-sm">
                    {new Date(movie.release_date).getFullYear()}
                  </span>
                  {movie.duration && (
                    <span className="text-gray-400 text-sm">
                      {movie.duration} min
                    </span>
                  )}
                </div>

                {/* note moyenne */}
                {movie.average_rating && (
                  <div className="flex items-center mb-3">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-white font-medium">
                      {movie.average_rating.toFixed(1)}/10
                    </span>
                  </div>
                )}
                
                {/* boutons d'action */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/movies/${movie.id_film}`)}
                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                  >
                    Détails
                  </button>
                  <button
                    onClick={() => toggleFavorite(movie.id_film)}
                    className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => toggleWatchlist(movie.id_film)}
                    className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    📝
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>
            
            <span className="text-white">
              Page {currentPage} sur {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </div>
        )}

        {/* message si aucun film */}
        {movies.length === 0 && !loading && (
          <div className="text-center text-gray-400 py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-medium mb-2">Aucun film trouvé</h3>
            <p>Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
