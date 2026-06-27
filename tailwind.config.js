/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        pogu: {
          black:   '#0a0a0a',
          surface: '#141414',
          surface2:'#1e1e1e',
          border:  'rgba(255,255,255,0.08)',
          yellow:  '#F5C518',
          red:     '#E8184D',
          brown:   '#8B4513',
          green:   '#2E7D32',
          pink:    '#C2185B',
          earth:   '#6D4C41',
          orange:  '#F57C00',
          muted:   'rgba(240,240,240,0.55)',
          cream:   '#FFFBF0',
          peach:   '#FFF5E6',
          dark:    '#1A1A1A',
        },
      },
      fontFamily: {
        head: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%':     { transform: 'translateY(-18px) rotate(-2deg)' },
        },
        floatAlt: {
          '0%,100%': { transform: 'translateY(0px) rotate(5deg)' },
          '50%':     { transform: 'translateY(-12px) rotate(5deg)' },
        },
        floatFront: {
          '0%,100%': { transform: 'translateY(0px) rotate(-6deg)' },
          '50%':     { transform: 'translateY(-10px) rotate(-6deg)' },
        },
        floatSlow: {
          '0%,100%': { transform: 'translateY(0px) rotate(3deg)' },
          '50%':     { transform: 'translateY(-10px) rotate(3deg)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        scrollLine: {
          '0%':   { transform: 'scaleY(0)', transformOrigin: 'top' },
          '50%':  { transform: 'scaleY(1)', transformOrigin: 'top' },
          '100%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
        },
        blobPulse: {
          '0%,100%': { transform: 'scale(1)', opacity: '0.18' },
          '50%':     { transform: 'scale(1.08)', opacity: '0.23' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float:       'float 4s ease-in-out infinite',
        'float-alt': 'floatAlt 4.5s ease-in-out infinite',
        'float-front':'floatFront 5s ease-in-out infinite',
        'float-slow': 'floatSlow 5.5s ease-in-out infinite',
        ticker:      'ticker 30s linear infinite',
        'scroll-line':'scrollLine 2s ease-in-out infinite',
        'blob-pulse': 'blobPulse 8s ease-in-out infinite',
        'fade-up':    'fadeUp 0.7s ease forwards',
      },
    },
  },
  plugins: [],
}
