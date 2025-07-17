import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

interface ApiResponse {
  count: number
  next?: string
  previous?: string
  results: Movie[]
}

interface MovieListProps {
  searchTerm: string
  selectedGenre: string
  currentPage: number
  onPageChange: (page: number) => void
  onTotalPagesChange: (totalPages: number) => void
}

export default function MovieList({ 
  searchTerm, 
  selectedGenre, 
  currentPage, 
  onPageChange,
  onTotalPagesChange 
}: MovieListProps) {
  const router = useRouter()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMovies()
  }, [currentPage, searchTerm, selectedGenre])

  const loadMovies = async () => {
    setLoading(true)
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
        onTotalPagesChange(Math.ceil(data.count / 10))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des films:', error)
    } finally {
      setLoading(false)
    }
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
        loadMovies()
      }
    } catch (error) {
      console.error('Erreur lors de la gestion de la watchlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="w-full h-64 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div key={movie.id_film} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="relative">
            {movie.main_image ? (
              <img
                src={movie.main_image.url}
                alt={movie.title}
                className="w-full h-64 object-cover cursor-pointer"
                onClick={() => router.push(`/movies/${movie.id_film}`)}
              />
            ) : (
              <div className="w-full h-64 bg-gray-300 flex items-center justify-center cursor-pointer"
                   onClick={() => router.push(`/movies/${movie.id_film}`)}>
                <span className="text-gray-500">Image non disponible</span>
              </div>
            )}
            
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => toggleFavorite(movie.id_film)}
                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                title="Ajouter aux favoris"
              >
                ❤️
              </button>
              <button
                onClick={() => toggleWatchlist(movie.id_film)}
                className="p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                title="Ajouter à la watchlist"
              >
                📌
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <h3 
              className="text-lg font-semibold mb-2 cursor-pointer text-black hover:text-indigo-600 transition-colors"
              onClick={() => router.push(`/movies/${movie.id_film}`)}
            >
              {movie.title}
            </h3>
            
            <p className="text-sm text-gray-600 mb-2">
              Sortie: {new Date(movie.release_date).getFullYear()}
            </p>
            
            {movie.duration && (
              <p className="text-sm text-gray-600 mb-2">
                Durée: {movie.duration} minutes
              </p>
            )}
            
            {movie.average_rating && (
              <div className="flex items-center mb-2">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600 ml-1">
                  {movie.average_rating.toFixed(1)}/5
                </span>
              </div>
            )}
            
            {movie.description && (
              <p className="text-sm text-gray-700 line-clamp-3">
                {movie.description.length > 100 
                  ? `${movie.description.substring(0, 100)}...` 
                  : movie.description
                }
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
