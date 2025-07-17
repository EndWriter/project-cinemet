'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface User {
  id_user: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: {
    id: number
    role: string
  } | null
  created_at: string
  updated_at: string
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const usersPerPage = 10

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (!loading) {
      fetchUsers()
    }
  }, [currentPage, searchTerm, loading])

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
        
        const isAdmin = userData.role && userData.role.role === 'admin'
        if (!isAdmin) {
          router.push('/home')
          return
        }
      }
      setLoading(false)
    } catch (error) {
      router.push('/login')
    }
  }

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: usersPerPage.toString(),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
        setTotalUsers(data.total || 0)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    }
  }

  const handleDelete = async (userId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchUsers() // Recharger la liste
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(totalUsers / usersPerPage)

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                👥 Gestion des Utilisateurs
              </h1>
              <Link href="/admin" className="text-blue-400 hover:text-blue-300">
                ← Retour au panneau d'administration
              </Link>
            </div>
            <Link href="/admin/users/new">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                + Nouvel Utilisateur
              </button>
            </Link>
          </div>

          {/* Barre de recherche */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setSearchTerm('')}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Effacer
              </button>
            </div>
          </div>
          {/* Table User*/}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-medium">ID</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Username</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Nom</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Email</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Rôle</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Créé le</th>
                    <th className="px-6 py-4 text-left text-white font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id_user} className="hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-gray-300">{user.id_user}</td>
                      <td className="px-6 py-4 text-white font-medium">{user.username}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role?.role === 'admin' 
                            ? 'bg-red-600/20 text-red-200 border border-red-500'
                            : 'bg-blue-600/20 text-blue-200 border border-blue-500'
                        }`}>
                          {user.role?.role || 'Aucun'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link href={`/admin/users/${user.id_user}`}>
                            <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                              Voir
                            </button>
                          </Link>
                          <Link href={`/admin/users/${user.id_user}/edit`}>
                            <button className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors text-sm">
                              Éditer
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(user.id_user)}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-xl mb-2">👤</div>
                  <p className="text-gray-400">Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Précédent
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}