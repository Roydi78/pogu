import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('commandes')
      .select(`
        *,
        lignes_commande (
          id, quantite, prix_unitaire,
          produits ( nom, image_url )
        )
      `)
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetch() }, [fetch])

  const updateStatut = async (id, statut) => {
    const { error } = await supabase.from('commandes').update({ statut }).eq('id', id)
    if (!error) setOrders(os => os.map(o => o.id === id ? { ...o, statut } : o))
    return { error }
  }

  const placeOrder = async ({ client, lignes }) => {
    const montant_total = lignes.reduce((s, l) => s + l.prix_unitaire * l.quantite, 0)
    const commande_id = crypto.randomUUID()

    const { error: cmdErr } = await supabase
      .from('commandes')
      .insert({ id: commande_id, ...client, montant_total, statut: 'en_attente' })
    if (cmdErr) return { error: cmdErr }

    const items = lignes.map(l => ({ ...l, commande_id }))
    const { error: linesErr } = await supabase.from('lignes_commande').insert(items)
    if (linesErr) return { error: linesErr }

    await fetch()
    return { data: { id: commande_id } }
  }

  return { orders, loading, error, updateStatut, placeOrder, refresh: fetch }
}
