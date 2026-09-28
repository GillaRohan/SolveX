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
        teal: {
          900: '#0D282A',
          800: '#113235',
          700: '#174246',
          600: '#1E5558',
          500: '#2A6B6E',
          accent: '#2DD4BF',
        },
        gold: {
          50: '#FBF5E8',
          100: '#F5E8C8',
          200: '#E8D3A7',
          300: '#D9BB7A',
          400: '#CDA84E',
          500: '#C99738',
          600: '#A47720',
          700: '#7D5A18',
          800: '#5C4011',
          900: '#3D2A0A',
        },
        workspace: {
          bg: '#F7F8F5',
          card: '#FFFFFF',
          input: '#F3F4F0',
          border: '#E2E6DF',
          'border-hover': '#D3DAD0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.04)',
        '2xs': '0 1px 1px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px rgba(13, 40, 42, 0.04), 0 1px 2px rgba(13, 40, 42, 0.02)',
        'card-hover': '0 6px 18px -4px rgba(13, 40, 42, 0.08), 0 2px 6px -2px rgba(13, 40, 42, 0.03)',
        'teal': '0 4px 14px rgba(17, 50, 53, 0.25)',
        'gold': '0 4px 14px rgba(201, 151, 56, 0.25)',
      },
      animation: {
        'in': 'fade-slide-in 0.25s ease-out',
      },
      keyframes: {
        'fade-slide-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
