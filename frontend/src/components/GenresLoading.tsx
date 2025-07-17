export default function GenresLoading() {
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
