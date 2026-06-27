import { useEffect, useRef } from 'react'

const PILLARS = [
  { icon: '🍰', label: 'Fait maison',    accent: 'border-pogu-yellow/40 hover:border-pogu-yellow hover:bg-yellow-50' },
  { icon: '🧊', label: 'Toujours frais', accent: 'border-pogu-green/40  hover:border-pogu-green  hover:bg-green-50'  },
  { icon: '🚀', label: 'Livré chez toi', accent: 'border-pogu-red/40    hover:border-pogu-red    hover:bg-red-50'    },
  { icon: '🎨', label: 'Design unique',  accent: 'border-pogu-orange/40  hover:border-pogu-orange hover:bg-orange-50' },
]

export default function Concept() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('opacity-100', 'translate-y-0')),
      { threshold: 0.15 }
    )
    ref.current?.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="concept" className="py-32 bg-pogu-cream" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Visual */}
          <div
            data-reveal
            className="relative opacity-0 translate-y-8 transition-all duration-700"
          >
            <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.10)]">
              <img
                src="/images/group.jpg"
                alt="Collection Pogù"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-pogu-yellow text-pogu-black font-head font-black text-xl text-center leading-tight px-6 py-5 rounded-2xl shadow-[0_12px_40px_rgba(245,197,24,0.35)]">
              9 parfums<br />disponibles
            </div>
          </div>

          {/* Text */}
          <div
            data-reveal
            className="opacity-0 translate-y-8 transition-all duration-700 delay-150"
          >
            <span className="inline-block font-head text-xs font-bold uppercase tracking-[0.2em] text-pogu-yellow mb-4">
              Le concept
            </span>
            <h2 className="font-head text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.1] tracking-tight text-pogu-dark mb-6">
              Un gâteau,<br />une canette.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              Pogù réinvente le dessert. Nos gâteaux en couches sont préparés artisanalement et conditionnés dans des canettes transparentes qui laissent voir toute la gourmandise à l'intérieur.
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              Frais, élégants, et déclinés en une palette de saveurs qui voyage du terroir africain aux classiques de la pâtisserie internationale.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {PILLARS.map((p) => (
                <div
                  key={p.label}
                  className={`flex items-center gap-3 bg-white border rounded-2xl px-4 py-4 transition-all ${p.accent}`}
                >
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-head text-sm font-semibold text-gray-800">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
