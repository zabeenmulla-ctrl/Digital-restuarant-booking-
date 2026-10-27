/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        gold: {
          50: '#fbf9ee',
          100: '#f6f1d5',
          200: '#eee2ad',
          300: '#e3cf7b',
          400: '#d8b94f',
          500: '#d4af37', // Royal Gold
          600: '#b88d29',
          700: '#926a23',
          800: '#795523',
          900: '#674722',
          950: '#3c260f',
        },
        crimson: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337', // Deep Crimson
          950: '#4c0519',
        },
        charcoal: {
          850: '#1c2622',
          900: '#131b17',
          950: '#0b100e', // Primary Dark Background
        },
        parchment: {
          50: '#fdfbf7',
          100: '#f5f0e8',
          200: '#e7dfd3',
          300: '#d3c4af',
        }
      },
      fontFamily: {
        royal: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        serif: ['Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
