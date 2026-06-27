import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-pogu-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pogu-yellow mb-5">
            <span className="font-head font-black text-2xl text-pogu-black">p</span>
          </div>
          <h1 className="font-head text-2xl font-black text-white">Administration pogù</h1>
          <p className="text-white/40 text-sm mt-1">Accès réservé</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-pogu-surface border border-white/10 rounded-3xl p-8 space-y-5">

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-sm rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@pogu.ci"
              className="w-full bg-pogu-surface2 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-pogu-yellow/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full bg-pogu-surface2 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-pogu-yellow/60 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pogu-yellow text-pogu-black font-head font-black text-sm py-3.5 rounded-xl hover:bg-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/50 transition-colors">Retour au site</a>
        </p>
      </div>
    </div>
  )
}
