/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'nuxt-green': {
          DEFAULT: '#00DC82',
          50: '#e6fff5',
          100: '#b3ffe0',
          200: '#80ffcc',
          300: '#4dffb8',
          400: '#1affa3',
          500: '#00DC82',
          600: '#00b368',
          700: '#008a50',
          800: '#006138',
          900: '#003820',
        },
        'nuxt-dark': {
          DEFAULT: '#0B0F19',
          50: '#1a1f2e',
          100: '#161b28',
          200: '#111622',
          300: '#0d111c',
          400: '#0B0F19',
          500: '#080c14',
          600: '#060910',
          700: '#04060b',
          800: '#020307',
          900: '#000102',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
