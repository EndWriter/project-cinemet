interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium border ${
            currentPage === page
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>
  )
}
