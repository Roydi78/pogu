export default function Footer() {
  return (
    <footer className="bg-pogu-cream border-t border-gray-200 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <span className="font-head text-4xl font-black text-pogu-yellow block mb-3 tracking-tight">
              pogù
            </span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Le dessert tendance en canette.<br />
              Des gâteaux frais, créatifs et savoureux.
            </p>
          </div>

          <div>
            <h4 className="font-head text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
              Navigation
            </h4>
            <ul className="space-y-3">
              {['Nos parfums', 'Le concept', 'Commander'].map(l => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(' ', '')}`} className="text-gray-500 text-sm hover:text-gray-900 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-head text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">
              Nous contacter
            </h4>
            <ul className="space-y-3">
              {['WhatsApp', 'Facebook', 'Instagram'].map(l => (
                <li key={l}>
                  <a href="#" className="text-gray-500 text-sm hover:text-gray-900 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-400 text-xs">
          <span>© 2026 Pogù. Tous droits réservés.</span>
          <span>Fait avec amour 🍰</span>
        </div>
      </div>
    </footer>
  )
}
