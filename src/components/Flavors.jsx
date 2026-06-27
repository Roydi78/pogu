import { useEffect, useRef, useState } from 'react'
import { useProducts } from '../hooks/useProducts'

const ACCENT_FALLBACK = {
  'Chocolat Vanille':   { accent: '#8B4513', bg: '#f5ede6' },
  'Fraise':             { accent: '#E8184D', bg: '#fde8ee' },
  'Coco Ananas':        { accent: '#d4a200', bg: '#fdf6e3' },
  'Hibiscus Vanille':   { accent: '#C2185B', bg: '#fce4ec' },
  'Mascarpone Vanille': { accent: '#2E7D32', bg: '#e8f5e9' },
  'Chocolat Gingembre': { accent: '#6D4C41', bg: '#efebe9' },
  'Orange':             { accent: '#F57C00', bg: '#fff3e0' },
  'Passion Mangue':     { accent: '#FF9800', bg: '#fff8e1' },
}
const DEFAULT_STYLE = { accent: '#F5C518', bg: '#f5f0e8' }

function getStyle(nom) {
  return ACCENT_FALLBACK[nom] || DEFAULT_STYLE
}

function Skeleton() {
  return (
    <div className="bg-pogu-black border border-white/[0.08] rounded-3xl overflow-hidden animate-pulse">
      <div className="h-64 bg-white/[0.06]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-white/[0.06] rounded-full w-1/2" />
        <div className="h-3 bg-white/[0.04] rounded-full w-full" />
        <div className="h-3 bg-white/[0.04] rounded-full w-3/4" />
      </div>
    </div>
  )
}

export default function Flavors({ onOrder }) {
  const { products, loading } = useProducts({ onlyActive: true })
  const gridRef = useRef(null)

  useEffect(() => {
    if (loading || !gridRef.current) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('opacity-100', 'translate-y-0'); observer.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    gridRef.current.querySelectorAll('[data-card]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [loading, products])

  return (
    <section id="parfums" className="py-32 bg-pogu-surface relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pogu-yellow to-transparent" />

      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block font-head text-xs font-bold uppercase tracking-[0.2em] text-pogu-yellow mb-4">
            La collection
          </span>
          <h2 className="font-head text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight tracking-tight text-white mb-4">
            Nos parfums
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Chaque canette est une nouvelle aventure gustative.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" ref={gridRef}>
          {loading
            ? [...Array(6)].map((_, i) => <Skeleton key={i} />)
            : products.map((p, i) => {
                const { accent, bg } = getStyle(p.nom)
                const linkColor = accent === '#d4a200' ? '#F5C518' : accent
                return (
                  <div
                    key={p.id}
                    data-card
                    className="group opacity-0 translate-y-8 transition-all duration-700 flex flex-col bg-pogu-black border border-white/[0.08] rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.5)] hover:border-white/[0.15]"
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <div className="w-full h-64 overflow-hidden" style={{ backgroundColor: bg }}>
                      {p.image_url
                        ? <img src={p.image_url} alt={p.nom} className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                        : <div className="w-full h-full flex items-center justify-center text-6xl">🍰</div>
                      }
                    </div>

                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="font-head text-lg font-bold text-white mb-2">{p.nom}</h3>
                      <p className="text-white/50 text-sm leading-relaxed flex-1 mb-4">{p.description || `Saveur ${p.parfum || p.nom} en canette.`}</p>
                      {p.prix && (
                        <p className="font-head font-black text-base mb-4" style={{ color: linkColor }}>
                          {Number(p.prix).toLocaleString('fr-CI')} FCFA
                        </p>
                      )}
                      <button
                        onClick={() => onOrder?.(p)}
                        className="font-head text-sm font-bold w-full py-2.5 rounded-xl border transition-all"
                        style={{ borderColor: `${accent}40`, color: linkColor }}
                        onMouseEnter={e => { e.currentTarget.style.background = `${accent}15` }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        Commander ce parfum →
                      </button>
                    </div>

                    <div className="h-1 w-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ background: accent }} />
                  </div>
                )
              })
          }
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 font-head text-base">Aucun produit disponible pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
