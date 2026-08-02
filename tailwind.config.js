/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sl: {
          maroon: '#8D153A',
          gold: '#FFBE29',
          green: '#007A3D',
          orange: '#FF7300',
          dark: '#0B0E14',
          card: '#121824',
          border: '#1F293D',
          code: '#07090E'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
