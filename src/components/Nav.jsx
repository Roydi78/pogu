import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Nos parfums', href: '#parfums' },
    { label: 'Le concept', href: '#concept' },
  ]

  if (isAdmin) {
    return (
      <header className="h-16 bg-pogu-surface border-b border-white/10 flex items-center px-6">
        <Link to="/" className="font-head text-2xl font-black text-pogu-yellow tracking-tight">
          pogù
        </Link>
        <span className="ml-3 text-xs font-head font-bold uppercase tracking-widest text-white/40">
          Administration
        </span>
      </header>
    )
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-pogu-black/85 backdrop-blur-xl border-b border-white/[0.08]' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="font-head text-3xl font-black text-pogu-yellow tracking-tight leading-none">
          pogù
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-head text-sm font-medium text-white/55 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#commander"
              className="font-head text-sm font-bold bg-pogu-yellow text-pogu-black px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              Commander
            </a>
          </li>
        </ul>

        {/* Burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${
                menuOpen && i === 0 ? 'rotate-45 translate-y-2' :
                menuOpen && i === 1 ? 'opacity-0' :
                menuOpen && i === 2 ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-pogu-black/95 backdrop-blur-xl border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-head text-base font-medium text-white/70 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#commander"
            onClick={() => setMenuOpen(false)}
            className="font-head text-sm font-bold bg-pogu-yellow text-pogu-black px-5 py-3 rounded-full text-center"
          >
            Commander
          </a>
        </div>
      )}
    </nav>
  )
}
