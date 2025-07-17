'use client'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import GenreFilter from '@/components/GenreFilter'
import MovieList from '@/components/MovieList'
import Pagination from '@/components/Pagination'
import MoviesLoading from '@/components/MoviesLoading'
import GenresLoading from '@/components/GenresLoading'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth()
  }, [])

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleTotalPagesChange = (totalPages: number) => {
    setTotalPages(totalPages)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Vérification de l'authentification...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Découvrez notre collection de films
          </h1>
          
          {/* Barre de recherche */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un film..."
                className="flex-1 px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                🔍
              </button>
            </div>
          </form>
          
          {/* Filtres par genre avec Suspense */}
          <Suspense fallback={<GenresLoading />}>
            <GenreFilter 
              selectedGenre={selectedGenre} 
              onGenreChange={handleGenreChange} 
            />
          </Suspense>
        </div>

        {/* Liste des films avec Suspense */}
        <Suspense fallback={<MoviesLoading />}>
          <MovieList
            searchTerm={searchTerm}
            selectedGenre={selectedGenre}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onTotalPagesChange={handleTotalPagesChange}
          />
        </Suspense>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
