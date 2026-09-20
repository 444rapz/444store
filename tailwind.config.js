/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#85effe',
          light: '#b0f6ff',
          dark: '#38d2e8',
          glow: 'rgba(133, 239, 254, 0.25)'
        },
        dark: {
          900: '#0a0d14',
          800: '#0f1422',
          700: '#171e31',
          600: '#232d47'
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(133, 239, 254, 0.3)',
        'neon-strong': '0 0 35px rgba(133, 239, 254, 0.5)',
      }
    },
  },
  plugins: [],
}
