import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ onlyActive = false } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    let q = supabase.from('produits').select('*').order('created_at', { ascending: false })
    if (onlyActive) q = q.eq('actif', true)
    const { data, error } = await q
    if (error) setError(error.message)
    else setProducts(data || [])
    setLoading(false)
  }, [onlyActive])

  useEffect(() => { fetch() }, [fetch])

  const add = async (payload) => {
    const { data, error } = await supabase.from('produits').insert(payload).select().single()
    if (!error) setProducts(ps => [data, ...ps])
    return { data, error }
  }

  const update = async (id, changes) => {
    const { data, error } = await supabase.from('produits').update(changes).eq('id', id).select().single()
    if (!error) setProducts(ps => ps.map(p => p.id === id ? data : p))
    return { data, error }
  }

  const remove = async (id) => {
    const { error } = await supabase.from('produits').delete().eq('id', id)
    if (!error) setProducts(ps => ps.filter(p => p.id !== id))
    return { error }
  }

  const toggleActif = (id, actif) => update(id, { actif })

  return { products, loading, error, add, update, remove, toggleActif, refresh: fetch }
}
