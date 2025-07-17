'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface RegisterForm {
  first_name: string
  last_name: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<RegisterForm>({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Effacer l'erreur quand l'utilisateur tape
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation simple
    if (!formData.first_name || !formData.last_name || !formData.username || !formData.email || !formData.password) {
      setError('Tous les champs sont obligatoires')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg text-center max-w-md">
          <div className="text-green-400 text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-white mb-4">Inscription réussie !</h2>
          <p className="text-gray-300">Redirection vers la connexion...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Cinemet</h1>
          <h2 className="mt-2 text-2xl font-bold text-gray-300">Créer un compte</h2>
        </div>

        {/* Formulaire */}
        <div className="bg-gray-800 p-8 rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-600/20 border border-red-500 text-red-200 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {/* Prénom et Nom */}
            <div className="grid grid-cols-2 gap-4">
              <input
                name="first_name"
                type="text"
                placeholder="Prénom"
                value={formData.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
              <input
                name="last_name"
                type="text"
                placeholder="Nom"
                value={formData.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Nom d'utilisateur */}
            <input
              name="username"
              type="text"
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Email */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Mot de passe */}
            <input
              name="password"
              type="password"
              placeholder="Mot de passe (min. 8 caractères)"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Confirmation mot de passe */}
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Lien vers connexion */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}