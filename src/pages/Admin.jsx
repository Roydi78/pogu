import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { useProducts } from '../hooks/useProducts'
import { useOrders } from '../hooks/useOrders'
import { supabase } from '../lib/supabase'

/* ─── Helpers ─── */
const fmt = (n) => Number(n).toLocaleString('fr-CI') + ' FCFA'

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

const SHORT_ID = (id) => (id || '').slice(0, 8).toUpperCase()

const STATUT_MAP = {
  en_attente:   { label: 'En attente',    cls: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' },
  confirmée:    { label: 'Confirmée',     cls: 'bg-blue-500/15 text-blue-400 border border-blue-500/30' },
  en_livraison: { label: 'En livraison',  cls: 'bg-purple-500/15 text-purple-400 border border-purple-500/30' },
  livrée:       { label: 'Livrée',        cls: 'bg-green-500/15 text-green-400 border border-green-500/30' },
  annulée:      { label: 'Annulée',       cls: 'bg-red-500/15 text-red-400 border border-red-500/30' },
}

const FLAVOR_COLORS = {
  default: { bg: '#f5f0e8', accent: '#F5C518' },
}

/* ─── Toast ─── */
function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-5 py-3.5 rounded-2xl font-head font-bold text-sm shadow-2xl transition-all ${
      toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
    }`}>
      {toast.type === 'error' ? '✕ ' : '✓ '}{toast.msg}
    </div>
  )
}

/* ─── Skeleton ─── */
function Skeleton({ className }) {
  return <div className={`bg-white/[0.06] animate-pulse rounded-xl ${className}`} />
}

/* ─── Badge statut ─── */
function Badge({ statut }) {
  const s = STATUT_MAP[statut] || STATUT_MAP.en_attente
  return <span className={`inline-block text-xs font-head font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${s.cls}`}>{s.label}</span>
}

/* ─── Modal produit ─── */
function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product?.id
  const [form, setForm] = useState(
    product?.id
      ? { ...product }
      : { nom: '', parfum: '', description: '', prix: 3500, image_url: '', actif: true }
  )
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: true })
    if (error) { setUploadError(error.message); setUploading(false); return }
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    set('image_url', data.publicUrl)
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.nom || !form.prix) return
    setSaving(true)
    const { error } = await onSave(form)
    setSaving(false)
    if (!error) onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-pogu-surface border border-white/10 rounded-3xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between mb-7">
          <h3 className="font-head text-xl font-bold text-white">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </h3>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="space-y-5">
          {/* Image preview + upload */}
          <div>
            <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-2">Image du produit</label>
            {form.image_url && (
              <div className="w-full h-36 rounded-2xl overflow-hidden mb-3" style={{ background: '#f5f0e8' }}>
                <img src={form.image_url} alt="" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex gap-3 items-center">
              <input
                value={form.image_url}
                onChange={e => set('image_url', e.target.value)}
                placeholder="https://... ou /images/produit.jpg"
                className="flex-1 bg-pogu-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-pogu-yellow/50 outline-none"
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="shrink-0 font-head font-bold text-xs border border-white/20 text-white/70 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {uploading ? '⏳' : '📁 Upload'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </div>
            {uploadError && (
              <p className="text-red-400 text-xs mt-2">Erreur upload : {uploadError}</p>
            )}
          </div>

          <Field label="Nom" value={form.nom} onChange={v => set('nom', v)} placeholder="Ex: Chocolat Vanille" />
          <Field label="Parfum" value={form.parfum} onChange={v => set('parfum', v)} placeholder="Ex: Chocolat Vanille" />
          <Field label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Description courte..." multiline />
          <Field label="Prix (FCFA)" value={form.prix} onChange={v => set('prix', Number(v))} type="number" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => set('actif', !form.actif)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.actif ? 'bg-pogu-yellow' : 'bg-white/20'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${form.actif ? 'left-7' : 'left-1'}`} />
            </button>
            <span className="text-white/60 text-sm">{form.actif ? 'Visible sur le site' : 'Masqué du site'}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 font-head font-bold text-sm border border-white/15 text-white/60 py-3.5 rounded-2xl hover:bg-white/5 transition-colors">
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.nom}
            className="flex-1 font-head font-bold text-sm bg-pogu-yellow text-pogu-black py-3.5 rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder = '', multiline = false }) {
  const cls = "w-full bg-pogu-black border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-pogu-yellow/50 outline-none transition-colors"
  return (
    <div>
      <label className="text-white/50 text-xs font-bold uppercase tracking-wider block mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

/* ─── Order detail modal ─── */
function OrderDetail({ order, onClose, onUpdateStatut }) {
  const [statut, setStatut] = useState(order.statut)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await onUpdateStatut(order.id, statut)
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-pogu-surface border border-white/10 rounded-3xl w-full max-w-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/40 text-xs font-head font-bold uppercase tracking-widest mb-1">Commande</p>
            <h3 className="font-head text-lg font-bold text-pogu-yellow">{SHORT_ID(order.id)}</h3>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-4 mb-6">
          <InfoRow label="Client" value={order.nom_client} />
          <InfoRow label="Téléphone" value={order.telephone} />
          <InfoRow label="Adresse" value={order.adresse} />
          {order.email && <InfoRow label="Email" value={order.email} />}
          {order.notes && <InfoRow label="Notes" value={order.notes} />}
          <InfoRow label="Date" value={fmtDate(order.created_at)} />
          <InfoRow label="Total" value={fmt(order.montant_total)} highlight />
        </div>

        {/* Lignes */}
        {order.lignes_commande?.length > 0 && (
          <div className="bg-pogu-black rounded-2xl p-4 mb-6">
            <p className="text-white/40 text-xs font-head font-bold uppercase tracking-wider mb-3">Produits commandés</p>
            {order.lignes_commande.map(l => (
              <div key={l.id} className="flex justify-between text-sm py-1.5 border-b border-white/[0.06] last:border-0">
                <span className="text-white/80">{l.produits?.nom || 'Produit supprimé'} ×{l.quantite}</span>
                <span className="text-white font-head font-semibold">{fmt(l.prix_unitaire * l.quantite)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Statut */}
        <div className="mb-6">
          <label className="text-white/40 text-xs font-head font-bold uppercase tracking-wider block mb-2">Statut de la commande</label>
          <select
            value={statut}
            onChange={e => setStatut(e.target.value)}
            className="w-full bg-pogu-black border border-white/10 text-white text-sm font-head rounded-xl px-4 py-3 outline-none focus:border-pogu-yellow/50"
          >
            {Object.entries(STATUT_MAP).map(([val, { label }]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 font-head font-bold text-sm border border-white/15 text-white/60 py-3.5 rounded-2xl hover:bg-white/5 transition-colors">
            Fermer
          </button>
          <button onClick={save} disabled={saving} className="flex-1 font-head font-bold text-sm bg-pogu-yellow text-pogu-black py-3.5 rounded-2xl hover:opacity-90 disabled:opacity-50 transition-opacity">
            {saving ? 'Sauvegarde…' : 'Mettre à jour'}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center text-sm py-1">
      <span className="text-white/40 font-head font-semibold">{label}</span>
      <span className={highlight ? 'text-pogu-yellow font-head font-black text-base' : 'text-white'}>{value}</span>
    </div>
  )
}

/* ─── Nav icons ─── */
const ICON = {
  Dashboard: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Produits:  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  Commandes: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
}

/* ─── MAIN ADMIN ─── */
export default function Admin() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Dashboard')
  const [modal, setModal] = useState(null)      // null | 'add' | product
  const [orderDetail, setOrderDetail] = useState(null)
  const [toast, setToast] = useState(null)
  const [searchOrder, setSearchOrder] = useState('')
  const [filterStatut, setFilterStatut] = useState('all')

  const { products, loading: loadP, error: errP, add, update, remove, toggleActif } = useProducts()
  const { orders, loading: loadO, error: errO, updateStatut } = useOrders()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleSaveProduct = async (form) => {
    const { id, ...payload } = form
    if (id) {
      const { error } = await update(id, payload)
      error ? showToast('Erreur: ' + error.message, 'error') : showToast('Produit mis à jour !')
      return { error }
    } else {
      const { error } = await add(payload)
      error ? showToast('Erreur: ' + error.message, 'error') : showToast('Produit ajouté !')
      return { error }
    }
  }

  const handleToggle = async (p) => {
    const { error } = await toggleActif(p.id, !p.actif)
    error ? showToast('Erreur: ' + error.message, 'error') : showToast(p.actif ? 'Produit masqué' : 'Produit visible')
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce produit définitivement ?')) return
    const { error } = await remove(id)
    error ? showToast('Erreur: ' + error.message, 'error') : showToast('Produit supprimé')
  }

  const handleUpdateStatut = async (id, statut) => {
    const { error } = await updateStatut(id, statut)
    error ? showToast('Erreur: ' + error.message, 'error') : showToast('Statut mis à jour !')
  }

  /* Stats */
  const totalRevenu   = orders.filter(o => o.statut === 'livrée').reduce((s, o) => s + Number(o.montant_total), 0)
  const nbAttente     = orders.filter(o => o.statut === 'en_attente').length
  const nbLivraison   = orders.filter(o => o.statut === 'en_livraison').length
  const prodActifs    = products.filter(p => p.actif).length

  /* Filtered orders */
  const filteredOrders = orders.filter(o => {
    const matchSearch = !searchOrder || o.nom_client?.toLowerCase().includes(searchOrder.toLowerCase()) || SHORT_ID(o.id).includes(searchOrder.toUpperCase())
    const matchStatut = filterStatut === 'all' || o.statut === filterStatut
    return matchSearch && matchStatut
  })

  return (
    <div className="min-h-screen bg-pogu-black">
      <Nav />
      <Toast toast={toast} />

      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* ── Sidebar ── */}
        <aside className="w-56 bg-pogu-surface border-r border-white/[0.08] flex flex-col py-6 shrink-0">
          {/* Stats mini */}
          <div className="px-4 mb-6">
            {nbAttente > 0 && (
              <div className="bg-pogu-yellow/10 border border-pogu-yellow/30 rounded-xl px-3 py-2 text-center">
                <span className="font-head font-black text-pogu-yellow text-xl">{nbAttente}</span>
                <p className="font-head text-[10px] font-bold uppercase tracking-widest text-white/50 mt-0.5">commande{nbAttente > 1 ? 's' : ''} en attente</p>
              </div>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-3 flex-1">
            {['Dashboard', 'Produits', 'Commandes'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left font-head text-sm font-semibold transition-all ${
                  tab === t ? 'bg-pogu-yellow text-pogu-black' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {ICON[t]}{t}
                {t === 'Commandes' && nbAttente > 0 && tab !== 'Commandes' && (
                  <span className="ml-auto bg-pogu-red text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{nbAttente}</span>
                )}
              </button>
            ))}
          </nav>

          <div className="px-3 space-y-1">
            <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-xl text-white/40 hover:text-white text-sm font-head font-semibold hover:bg-white/5 transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Voir le site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-red-400/70 hover:text-red-400 text-sm font-head font-semibold hover:bg-red-500/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 overflow-y-auto scrollbar-thin p-8">

          {/* ── DASHBOARD ── */}
          {tab === 'Dashboard' && (
            <div>
              <h1 className="font-head text-2xl font-black text-white mb-1">Tableau de bord</h1>
              <p className="text-white/40 text-sm mb-8">Vue d'ensemble de votre boutique Pogù.</p>

              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {[
                  { label: 'Commandes totales', val: orders.length, sub: 'depuis le début',          border: 'border-pogu-yellow' },
                  { label: 'En attente',         val: nbAttente,     sub: 'à traiter de toute urgence', border: 'border-yellow-500' },
                  { label: 'En livraison',        val: nbLivraison,   sub: 'en cours',                border: 'border-purple-500' },
                  { label: 'Revenus livrés',      val: fmt(totalRevenu), sub: 'commandes livrées',    border: 'border-green-500' },
                ].map(s => (
                  <div key={s.label} className={`bg-pogu-surface border border-white/[0.08] border-l-4 ${s.border} rounded-2xl p-5`}>
                    <p className="text-white/40 text-xs font-head font-bold uppercase tracking-widest mb-2">{s.label}</p>
                    <p className="font-head text-2xl font-black text-white">{loadO ? <Skeleton className="h-8 w-16" /> : s.val}</p>
                    <p className="text-white/30 text-xs mt-1">{s.sub}</p>
                  </div>
                ))}
              </div>

              {/* Active products */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-pogu-surface border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-white/40 text-xs font-head font-bold uppercase tracking-widest mb-3">Produits actifs</p>
                  <p className="font-head text-4xl font-black text-pogu-yellow">{prodActifs}<span className="text-lg text-white/30">/{products.length}</span></p>
                </div>
                <div className="bg-pogu-surface border border-white/[0.08] rounded-2xl p-5">
                  <p className="text-white/40 text-xs font-head font-bold uppercase tracking-widest mb-3">Commandes aujourd'hui</p>
                  <p className="font-head text-4xl font-black text-white">
                    {orders.filter(o => o.created_at?.startsWith(new Date().toISOString().slice(0,10))).length}
                  </p>
                </div>
              </div>

              {/* Recent orders */}
              <h2 className="font-head text-xs font-bold uppercase tracking-widest text-white/40 mb-3">Commandes récentes</h2>
              <div className="bg-pogu-surface border border-white/[0.08] rounded-2xl overflow-hidden">
                {loadO ? (
                  <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
                ) : orders.length === 0 ? (
                  <p className="text-white/30 text-sm font-head text-center py-10">Aucune commande pour l'instant.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        {['ID', 'Client', 'Montant', 'Statut', 'Date'].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 font-head text-xs font-bold uppercase tracking-widest text-white/40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 6).map(o => (
                        <tr key={o.id} onClick={() => setOrderDetail(o)} className="border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer transition-colors">
                          <td className="px-5 py-3.5 font-head font-bold text-pogu-yellow text-xs">{SHORT_ID(o.id)}</td>
                          <td className="px-5 py-3.5 text-white font-medium">{o.nom_client}</td>
                          <td className="px-5 py-3.5 font-head font-semibold text-white">{fmt(o.montant_total)}</td>
                          <td className="px-5 py-3.5"><Badge statut={o.statut} /></td>
                          <td className="px-5 py-3.5 text-white/40 text-xs">{fmtDate(o.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ── PRODUITS ── */}
          {tab === 'Produits' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="font-head text-2xl font-black text-white mb-1">Produits</h1>
                  <p className="text-white/40 text-sm">Gérez votre catalogue de desserts.</p>
                </div>
                <button
                  onClick={() => setModal('add')}
                  className="font-head font-bold text-sm bg-pogu-yellow text-pogu-black px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                  + Ajouter un produit
                </button>
              </div>

              {errP && <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm rounded-2xl px-5 py-3 mb-6">{errP}</div>}

              {loadP ? (
                <div className="grid grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}</div>
              ) : products.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-5xl mb-4">🍰</p>
                  <p className="font-head text-lg font-bold text-white/50">Aucun produit</p>
                  <p className="text-white/30 text-sm mt-1">Ajoutez votre premier parfum</p>
                  <button onClick={() => setModal('add')} className="mt-6 font-head font-bold text-sm bg-pogu-yellow text-pogu-black px-6 py-3 rounded-full">
                    + Ajouter un produit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(p => (
                    <div key={p.id} className={`bg-pogu-surface border rounded-2xl overflow-hidden transition-all ${p.actif ? 'border-white/[0.08]' : 'border-white/[0.04] opacity-55'}`}>
                      <div className="h-44 overflow-hidden" style={{ background: '#f5f0e8' }}>
                        {p.image_url
                          ? <img src={p.image_url} alt={p.nom} className="w-full h-full object-contain" />
                          : <div className="w-full h-full flex items-center justify-center text-4xl">🍰</div>
                        }
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-head text-sm font-bold text-white leading-tight">{p.nom}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-head font-bold shrink-0 ${p.actif ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-white/40'}`}>
                            {p.actif ? 'Actif' : 'Masqué'}
                          </span>
                        </div>
                        {p.description && <p className="text-white/40 text-xs leading-relaxed mb-2 line-clamp-2">{p.description}</p>}
                        <p className="font-head text-lg font-black text-pogu-yellow mb-4">{fmt(p.prix)}</p>
                        <div className="flex gap-2">
                          <button onClick={() => setModal(p)} className="flex-1 text-xs font-head font-bold border border-white/10 text-white/60 py-2 rounded-lg hover:bg-white/5 transition-colors">
                            Modifier
                          </button>
                          <button onClick={() => handleToggle(p)} className="flex-1 text-xs font-head font-bold border border-white/10 text-white/60 py-2 rounded-lg hover:bg-white/5 transition-colors">
                            {p.actif ? 'Masquer' : 'Afficher'}
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="text-xs font-head font-bold border border-red-500/20 text-red-400/70 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors">
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── COMMANDES ── */}
          {tab === 'Commandes' && (
            <div>
              <h1 className="font-head text-2xl font-black text-white mb-1">Commandes</h1>
              <p className="text-white/40 text-sm mb-6">Suivez et gérez toutes vos commandes.</p>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-6">
                <input
                  value={searchOrder}
                  onChange={e => setSearchOrder(e.target.value)}
                  placeholder="Rechercher un client ou ID…"
                  className="bg-pogu-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-pogu-yellow/50 outline-none flex-1 min-w-48"
                />
                <select
                  value={filterStatut}
                  onChange={e => setFilterStatut(e.target.value)}
                  className="bg-pogu-surface border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm outline-none focus:border-pogu-yellow/50"
                >
                  <option value="all">Tous les statuts</option>
                  {Object.entries(STATUT_MAP).map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              {errO && <div className="bg-red-900/30 border border-red-500/30 text-red-400 text-sm rounded-2xl px-5 py-3 mb-6">{errO}</div>}

              {loadO ? (
                <div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-5xl mb-4">📋</p>
                  <p className="font-head text-lg font-bold text-white/50">
                    {orders.length === 0 ? 'Aucune commande pour l\'instant' : 'Aucun résultat'}
                  </p>
                </div>
              ) : (
                <div className="bg-pogu-surface border border-white/[0.08] rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/[0.08]">
                          {['ID', 'Client', 'Téléphone', 'Montant', 'Statut', 'Date', ''].map(h => (
                            <th key={h} className="text-left px-4 py-4 font-head text-xs font-bold uppercase tracking-widest text-white/40">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(o => (
                          <tr key={o.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3.5 font-head font-bold text-pogu-yellow text-xs">{SHORT_ID(o.id)}</td>
                            <td className="px-4 py-3.5 text-white font-medium">{o.nom_client}</td>
                            <td className="px-4 py-3.5 text-white/50 text-xs">{o.telephone}</td>
                            <td className="px-4 py-3.5 font-head font-semibold text-white">{fmt(o.montant_total)}</td>
                            <td className="px-4 py-3.5"><Badge statut={o.statut} /></td>
                            <td className="px-4 py-3.5 text-white/40 text-xs">{fmtDate(o.created_at)}</td>
                            <td className="px-4 py-3.5">
                              <button
                                onClick={() => setOrderDetail(o)}
                                className="font-head font-bold text-xs border border-white/10 text-white/60 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                              >
                                Détails
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSaveProduct}
        />
      )}
      {orderDetail && (
        <OrderDetail
          order={orderDetail}
          onClose={() => setOrderDetail(null)}
          onUpdateStatut={handleUpdateStatut}
        />
      )}
    </div>
  )
}
