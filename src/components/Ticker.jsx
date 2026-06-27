const ITEMS = [
  'Chocolat Vanille', 'Coco Ananas', 'Fraise', 'Hibiscus Vanille',
  'Mascarpone', 'Choco Gingembre', 'Passion Mangue', 'Orange',
]

export default function Ticker() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className="bg-pogu-yellow py-3.5 overflow-hidden whitespace-nowrap">
      <div className="inline-block animate-ticker">
        {doubled.map((item, i) => (
          <span key={i} className="inline-block font-head text-sm font-black uppercase tracking-widest text-pogu-black">
            <span className="px-5">{item}</span>
            <span className="px-2 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
