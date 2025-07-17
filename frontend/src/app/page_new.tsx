'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers la page d'accueil
    router.push('/home')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-white text-xl">Redirection...</div>
    </div>
  )
}
