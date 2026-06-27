const STATS = [
  { num: '9',    label: 'Parfums uniques' },
  { num: '100%', label: 'Fait maison' },
  { num: '48h',  label: 'Livraison rapide' },
  { num: '+90',  label: 'Clients satisfaits' },
]

export default function Stats() {
  return (
    <div className="py-16" style={{ background: 'linear-gradient(135deg, #F5C518 0%, #F57C00 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <span className="block font-head text-5xl font-black text-white leading-none mb-2">
                {s.num}
              </span>
              <span className="text-white/80 text-sm font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
