/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}" ],
  theme: {
    extend: {
      fontFamily: { mono: ['"Roboto Mono"', 'monospace'] },
      colors: {
        'neural-bg': '#010008',
        'neural-text': '#C5C6C7',
        'neural-dim': '#6B6E70',
        'glitch-green': '#00FF41',
        'glitch-magenta': '#FF00FF',
      },
      animation: {
        scanline: 'scanline 10s linear infinite',
        glitch: 'glitch 1.5s linear infinite',
      },
      keyframes: {
        scanline: { '0%': { backgroundPosition: '0 0' }, '100%': { backgroundPosition: '0 -100px' } },
        glitch: { /* Complex keyframes for glitch effect */ },
      }
    },
  },
  plugins: [],
};