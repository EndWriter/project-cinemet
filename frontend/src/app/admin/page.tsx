'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function AdminPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

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
      
      if (response.ok) {
        const responseData = await response.json()
        const userData = responseData.user || responseData
        // Vérifier si l'utilisateur est admin
        const isAdmin = userData.role && userData.role.role === 'admin'
        
        if (!isAdmin) {
          alert(`Accès refusé. Votre rôle: ${userData.role?.role || 'aucun'} - Vous devez être admin pour accéder à cette page.`)
          router.push('/home')
          return
        }
        setUser(userData)
      }
      setLoading(false)
    } catch (error) {
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  const adminSections = [
    {
      title: 'Gestion des Utilisateurs',
      description: 'Créer, modifier et supprimer des utilisateurs',
      icon: '👥',
      href: '/admin/users',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Gestion des Films',
      description: 'Gérer la base de données des films',
      icon: '🎬',
      href: '/admin/movies',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Gestion des Acteurs',
      description: 'Ajouter et modifier les informations des acteurs',
      icon: '🎭',
      href: '/admin/actors',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Gestion des Réalisateurs',
      description: 'Gérer les réalisateurs et leurs informations',
      icon: '🎯',
      href: '/admin/directors',
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              🛠️ Panneau d'Administration
            </h1>
            <p className="text-gray-300 text-lg">
              Bienvenue {user?.first_name} ! Gérez votre plateforme Cinemet
            </p>
          </div>
          {/* Sections d'admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adminSections.map((section, index) => (
              <Link key={index} href={section.href}>
                <div className={`${section.color} p-8 rounded-lg transition-all duration-200 transform hover:scale-105 cursor-pointer`}>
                  <div className="flex items-center mb-4">
                    <span className="text-4xl mr-4">{section.icon}</span>
                    <h3 className="text-2xl font-bold text-white">{section.title}</h3>
                  </div>
                  <p className="text-gray-100 mb-4">{section.description}</p>
                  <div className="flex items-center text-white">
                    <span>Accéder</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}