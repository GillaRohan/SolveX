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
        bis: {
          950: '#071626',
          900: '#0A2540',
          850: '#0D2E4E',
          800: '#003366',
          700: '#004080',
          600: '#0052CC',
          500: '#1A73E8',
          400: '#4285F4',
          300: '#8AB4F8',
          200: '#D2E3FC',
          100: '#E8F0FE',
          50: '#F4F7FB',
        },
        slate: {
          850: '#151E2E',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px -1px rgba(10, 37, 64, 0.08), 0 1px 4px -1px rgba(10, 37, 64, 0.04)',
        'card-hover': '0 8px 24px -2px rgba(10, 37, 64, 0.12), 0 3px 8px -2px rgba(10, 37, 64, 0.06)',
        'glow': '0 0 20px rgba(0, 82, 204, 0.25)',
      }
    },
  },
  plugins: [],
}
