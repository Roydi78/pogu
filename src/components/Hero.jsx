import { useEffect, useRef } from 'react'

const CANS = [
  {
    src:  '/images/hibiscus-vanille.jpg',
    alt:  'Hibiscus Vanille',
    cls:  'absolute top-4 left-0 w-44',
    wrapperCls: 'animate-float-slow',
    zIndex: 1,
  },
  {
    src:  '/images/choco-vanille.jpg',
    alt:  'Chocolat Vanille',
    cls:  'absolute top-8 left-1/2 -translate-x-1/2 w-56',
    wrapperCls: 'animate-float',
    zIndex: 3,
  },
  {
    src:  '/images/coco-ananas.jpg',
    alt:  'Coco Ananas',
    cls:  'absolute bottom-8 right-0 w-40',
    wrapperCls: 'animate-float-alt',
    zIndex: 2,
  },
]

export default function Hero({ onOrder }) {
  const blobsRef = useRef([])

  useEffect(() => {
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 18
      blobsRef.current.forEach((el, i) => {
        if (!el) return
        const f = (i + 1) * 0.4
        el.style.transform = `translate(${x * f}px, ${y * f}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-24 pb-16">

      {/* Blobs couleur */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div ref={el => blobsRef.current[0] = el}
          className="absolute w-[600px] h-[600px] rounded-full bg-pogu-yellow blur-[100px] opacity-30 -top-32 -right-32 transition-transform duration-700 ease-out" />
        <div ref={el => blobsRef.current[1] = el}
          className="absolute w-[450px] h-[450px] rounded-full bg-pogu-orange blur-[80px] opacity-25 -bottom-20 -left-20 transition-transform duration-700 ease-out" />
        <div ref={el => blobsRef.current[2] = el}
          className="absolute w-[320px] h-[320px] rounded-full bg-pogu-red blur-[70px] opacity-20 bottom-1/3 right-1/4 transition-transform duration-700 ease-out" />
        <div
          className="absolute w-[260px] h-[260px] rounded-full bg-pogu-green blur-[60px] opacity-15 top-1/3 left-1/4 transition-transform duration-700 ease-out" />
      </div>

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* Texte */}
        <div>
          <span className="inline-flex items-center gap-2 bg-pogu-yellow/15 border border-pogu-yellow/40 text-amber-700 text-xs font-head font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            ✦ Nouveau &bull; Dessert en canette
          </span>

          <h1 className="font-head text-[clamp(3rem,7vw,5.5rem)] font-black leading-[1.0] tracking-tight text-pogu-dark mb-6">
            Le dessert<br />
            <span className="text-pogu-yellow">pogù</span><br />
            dans ta poche
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
            Des gâteaux frais, créatifs et savoureux,<br className="hidden sm:block" />
            à déguster partout, à tout moment.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#parfums"
              className="font-head font-bold text-sm bg-pogu-yellow text-pogu-black px-7 py-4 rounded-full hover:bg-yellow-300 hover:-translate-y-0.5 transition-all shadow-[0_8px_30px_rgba(245,197,24,0.4)]"
            >
              Découvrir les parfums
            </a>
            <button
              onClick={onOrder}
              className="font-head font-bold text-sm bg-transparent text-gray-800 border-2 border-gray-300 px-7 py-4 rounded-full hover:border-gray-500 hover:bg-gray-50 hover:-translate-y-0.5 transition-all"
            >
              Commander maintenant
            </button>
          </div>
        </div>

        {/* Canettes */}
        <div className="hidden lg:block">
          <div className="relative" style={{ height: '520px' }}>

            {/* Canette fantôme fond */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0 }}>
              <img
                src="/images/fraise.jpg"
                alt=""
                className="w-72 object-contain opacity-[0.06] blur-[20px] scale-125"
              />
            </div>

            {/* 3 canettes */}
            {CANS.map(can => (
              <div key={can.alt} className={can.cls} style={{ zIndex: can.zIndex, position: 'absolute' }}>
                <div className={can.wrapperCls}>
                  <div className="rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] bg-white/80">
                    <img
                      src={can.src}
                      alt={can.alt}
                      className="w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Reflet sol */}
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(245,197,24,0.08), transparent)' }} />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-head text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gray-400">Défiler</span>
        <div className="w-px h-12 bg-gradient-to-b from-pogu-yellow to-transparent" />
      </div>
    </section>
  )
}
