export default function CTASection({ onOrder }) {
  return (
    <section
      id="commander"
      className="relative py-36 overflow-hidden text-center"
      style={{ background: 'linear-gradient(135deg, #F57C00 0%, #E8184D 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-pogu-yellow blur-[120px] opacity-25 -top-48 -right-48" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-white blur-[100px] opacity-10 -bottom-36 -left-36" />
      </div>

      <div className="max-w-2xl mx-auto px-6 relative z-10">
        <span className="inline-block font-head text-xs font-bold uppercase tracking-[0.2em] text-white/75 mb-6">
          Prêt à craquer ?
        </span>
        <h2 className="font-head text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-[1.05] tracking-tight text-white mb-5">
          Commande ta canette{' '}
          <span className="text-pogu-yellow">pogù</span>{' '}
          maintenant
        </h2>
        <p className="text-white/75 text-base leading-relaxed mb-12">
          Choisissez votre parfum, indiquez votre adresse,<br />
          et recevez votre dessert frais en 48h.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onOrder}
            className="font-head font-black text-base bg-pogu-yellow text-pogu-black px-10 py-5 rounded-full hover:bg-yellow-300 hover:-translate-y-0.5 transition-all shadow-[0_12px_40px_rgba(0,0,0,0.20)]"
          >
            Passer une commande
          </button>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-head font-bold text-sm flex items-center justify-center gap-2 bg-white/15 text-white border border-white/30 px-8 py-5 rounded-full hover:bg-white/25 hover:-translate-y-0.5 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Suivre sur Facebook
          </a>
        </div>
      </div>
    </section>
  )
}
