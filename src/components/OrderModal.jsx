import { useState } from 'react'
import { useProducts } from '../hooks/useProducts'
import { useOrders } from '../hooks/useOrders'

const fmt = (n) => Number(n).toLocaleString('fr-CI') + ' FCFA'

function Field({ label, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-1.5">
        {label}{required && <span className="text-pogu-red ml-1">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-pogu-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-pogu-yellow/50 outline-none transition-colors placeholder:text-white/20"
      />
    </div>
  )
}

export default function OrderModal({ initialProduct = null, onClose }) {
  const { products } = useProducts({ onlyActive: true })
  const { placeOrder } = useOrders()

  const [cart, setCart] = useState(
    initialProduct ? [{ produit: initialProduct, quantite: 1 }] : []
  )
  const [form, setForm] = useState({ nom_client: '', telephone: '', adresse: '', email: '', notes: '' })
  const [step, setStep] = useState(initialProduct ? 'form' : 'products')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addToCart = (p) => {
    setCart(c => {
      const existing = c.find(i => i.produit.id === p.id)
      if (existing) return c.map(i => i.produit.id === p.id ? { ...i, quantite: i.quantite + 1 } : i)
      return [...c, { produit: p, quantite: 1 }]
    })
  }

  const removeFromCart = (id) => setCart(c => c.filter(i => i.produit.id !== id))

  const changeQty = (id, delta) => {
    setCart(c => c.map(i => i.produit.id === id
      ? { ...i, quantite: Math.max(1, i.quantite + delta) }
      : i
    ))
  }

  const total = cart.reduce((s, i) => s + Number(i.produit.prix) * i.quantite, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (cart.length === 0) { setError('Ajoutez au moins un produit.'); return }
    if (!form.nom_client || !form.telephone || !form.adresse) { setError('Remplissez les champs obligatoires.'); return }
    setSubmitting(true)
    setError(null)
    const lignes = cart.map(i => ({
      produit_id: i.produit.id,
      quantite: i.quantite,
      prix_unitaire: i.produit.prix,
    }))
    const { error: err } = await placeOrder({ client: form, lignes })
    setSubmitting(false)
    if (err) { setError(err.message); return }
    setSuccess(true)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-pogu-surface border border-white/10 rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto scrollbar-thin">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-0 sticky top-0 bg-pogu-surface z-10">
          <div>
            <h2 className="font-head text-xl font-black text-white">Commander</h2>
            {!success && (
              <div className="flex gap-2 mt-2">
                {['products', 'form'].map((s, idx) => (
                  <div key={s} className={`flex items-center gap-1.5 font-head text-xs font-bold ${step === s ? 'text-pogu-yellow' : 'text-white/30'}`}>
                    {idx > 0 && <span className="text-white/20">›</span>}
                    <span>{idx === 0 ? '1. Sélection' : '2. Coordonnées'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl ml-4">✕</button>
        </div>

        <div className="px-7 py-6">
          {/* SUCCESS */}
          {success ? (
            <div className="text-center py-10">
              <div className="text-6xl mb-5">🎉</div>
              <h3 className="font-head text-2xl font-black text-white mb-3">Commande envoyée !</h3>
              <p className="text-white/50 text-sm mb-2">Nous avons bien reçu votre commande.</p>
              <p className="text-white/50 text-sm mb-8">Nous vous contacterons au <span className="text-white font-semibold">{form.telephone}</span> pour confirmer et organiser la livraison.</p>
              <button onClick={onClose} className="font-head font-bold text-sm bg-pogu-yellow text-pogu-black px-8 py-3.5 rounded-full">
                Fermer
              </button>
            </div>
          ) : step === 'products' ? (
            /* STEP 1 — Sélection produits */
            <>
              <p className="text-white/40 text-sm mb-5">Choisissez vos parfums et quantités :</p>

              <div className="space-y-3 mb-6">
                {products.map(p => {
                  const inCart = cart.find(i => i.produit.id === p.id)
                  return (
                    <div key={p.id} className={`flex items-center gap-3 bg-pogu-black border rounded-2xl p-3 transition-all ${inCart ? 'border-pogu-yellow/40' : 'border-white/[0.08]'}`}>
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: '#f5f0e8' }}>
                        {p.image_url
                          ? <img src={p.image_url} alt={p.nom} className="w-full h-full object-contain" />
                          : <div className="w-full h-full flex items-center justify-center text-2xl">🍰</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-head text-sm font-bold text-white truncate">{p.nom}</p>
                        <p className="font-head text-xs font-black text-pogu-yellow">{fmt(p.prix)}</p>
                      </div>
                      {inCart ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => changeQty(p.id, -1)} className="w-7 h-7 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center text-sm font-bold">−</button>
                          <span className="font-head font-black text-white w-5 text-center">{inCart.quantite}</span>
                          <button onClick={() => changeQty(p.id, +1)} className="w-7 h-7 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center text-sm font-bold">+</button>
                          <button onClick={() => removeFromCart(p.id)} className="w-7 h-7 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 flex items-center justify-center text-xs ml-1">✕</button>
                        </div>
                      ) : (
                        <button onClick={() => addToCart(p)} className="shrink-0 font-head font-bold text-xs bg-pogu-yellow text-pogu-black px-3 py-2 rounded-xl hover:opacity-90 transition-opacity">
                          + Ajouter
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Cart summary */}
              {cart.length > 0 && (
                <div className="bg-pogu-black border border-pogu-yellow/20 rounded-2xl p-4 mb-6">
                  <p className="font-head text-xs font-bold uppercase tracking-wider text-white/40 mb-3">Mon panier</p>
                  {cart.map(i => (
                    <div key={i.produit.id} className="flex justify-between text-sm py-1">
                      <span className="text-white/70">{i.produit.nom} ×{i.quantite}</span>
                      <span className="text-white font-head font-semibold">{fmt(Number(i.produit.prix) * i.quantite)}</span>
                    </div>
                  ))}
                  <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                    <span className="font-head font-bold text-white">Total</span>
                    <span className="font-head font-black text-pogu-yellow">{fmt(total)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={() => { if (cart.length === 0) return; setStep('form') }}
                disabled={cart.length === 0}
                className="w-full font-head font-black text-sm bg-pogu-yellow text-pogu-black py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuer → ({cart.length} article{cart.length > 1 ? 's' : ''})
              </button>
            </>
          ) : (
            /* STEP 2 — Informations client */
            <form onSubmit={handleSubmit}>
              <button type="button" onClick={() => setStep('products')} className="text-white/40 hover:text-white text-sm font-head font-semibold mb-5 flex items-center gap-1">
                ← Retour aux produits
              </button>

              {/* Recap */}
              <div className="bg-pogu-black border border-white/[0.08] rounded-2xl p-4 mb-6">
                {cart.map(i => (
                  <div key={i.produit.id} className="flex justify-between text-sm py-1">
                    <span className="text-white/60">{i.produit.nom} ×{i.quantite}</span>
                    <span className="text-white font-head font-semibold">{fmt(Number(i.produit.prix) * i.quantite)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 mt-2 pt-2 flex justify-between">
                  <span className="font-head font-bold text-white">Total</span>
                  <span className="font-head font-black text-pogu-yellow text-lg">{fmt(total)}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <Field label="Votre nom" value={form.nom_client} onChange={v => set('nom_client', v)} placeholder="Kofi Ama" required />
                <Field label="Téléphone" value={form.telephone} onChange={v => set('telephone', v)} placeholder="+225 07 00 00 00" type="tel" required />
                <Field label="Adresse de livraison" value={form.adresse} onChange={v => set('adresse', v)} placeholder="Quartier, Ville" required />
                <Field label="Email (optionnel)" value={form.email} onChange={v => set('email', v)} placeholder="votre@email.com" type="email" />
                <div>
                  <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-1.5">Notes (optionnel)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="Instructions de livraison, parfum de substitution…"
                    rows={2}
                    className="w-full bg-pogu-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-pogu-yellow/50 outline-none resize-none placeholder:text-white/20"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full font-head font-black text-sm bg-pogu-yellow text-pogu-black py-4 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? 'Envoi en cours…' : `Confirmer ma commande — ${fmt(total)}`}
              </button>

              <p className="text-white/30 text-xs text-center mt-4">
                Paiement à la livraison. Nous vous contacterons pour confirmer.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
