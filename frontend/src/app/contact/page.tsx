'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

export default function ContactPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Vérifier l'authentification
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
      // Pré-remplir le nom et email
      if (response.ok) {
        const userData = await response.json()
        setFormData(prev => ({
          ...prev,
          name: userData.first_name && userData.last_name 
            ? `${userData.first_name} ${userData.last_name}` 
            : userData.first_name || '',
          email: userData.email || ''
        }))
      }
      setLoading(false)
    } catch (error) {
      router.push('/login')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setSubmitMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
        // Réinitialiser le formulaire
        setFormData(prev => ({
          name: prev.name,
          email: prev.email,
          subject: '',
          message: ''
        }))
      } else {
        const errorData = await response.json()
        setSubmitSuccess(false)
        setSubmitMessage(errorData.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.')
      }
    } catch (error) {
      setSubmitSuccess(false)
      setSubmitMessage('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">
            Nous Contacter
          </h1>

          <div className="bg-gray-800 rounded-lg p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                📧 Envoyez-nous un message
              </h2>
              <p className="text-gray-300">
                Vous avez une question, une suggestion ou un problème ? 
                N'hésitez pas à nous contacter via le formulaire ci-dessous.
              </p>
            </div>

            {/* Message de confirmation/erreur */}
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitSuccess 
                  ? 'bg-green-600/20 border border-green-500 text-green-200' 
                  : 'bg-red-600/20 border border-red-500 text-red-200'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">
                    {submitSuccess ? '✅' : '❌'}
                  </span>
                  {submitMessage}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="votre.email@exemple.com"
                />
              </div>

              {/* Sujet */}
              <div>
                <label htmlFor="subject" className="block text-white font-medium mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Sujet de votre message"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer le message'
                )}
              </button>
            </form>

            {/* Informations supplémentaires */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                📞 Autres moyens de contact
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>
                  <span className="font-medium">Email direct :</span> admin@cinemet.com
                </p>
                <p>
                  <span className="font-medium">Temps de réponse :</span> Généralement sous 24-48h
                </p>
                <p className="text-sm text-gray-400">
                  * Tous les champs sont obligatoires
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}