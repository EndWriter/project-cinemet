import { useState, useEffect } from 'react'

interface Genre {
  id: number
  name: string
}

interface GenreFilterProps {
  selectedGenre: string
  onGenreChange: (genre: string) => void
}

export default function GenreFilter({ selectedGenre, onGenreChange }: GenreFilterProps) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGenres()
  }, [])

  const loadGenres = async () => {
    try {
      const response = await fetch('/api/movies/genres')
      if (response.ok) {
        const data = await response.json()
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
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {[...Array(6)].map((_, index) => (
          <div 
            key={index} 
            className="px-4 py-2 bg-gray-300 rounded-full animate-pulse h-8 w-20"
          ></div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => onGenreChange('')}
        className={`px-4 py-2 rounded-full transition-colors ${
          selectedGenre === '' 
            ? 'bg-indigo-600 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Tous
      </button>
      {genres.map((genre) => (
        <button
          key={genre.id}
          onClick={() => onGenreChange(genre.name)}
          className={`px-4 py-2 rounded-full transition-colors ${
            selectedGenre === genre.name 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  )
}
