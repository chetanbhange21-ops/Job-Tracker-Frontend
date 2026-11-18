/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f3f4ff',
          100: '#e8eaff',
          200: '#d3d7ff',
          300: '#b0b7ff',
          400: '#8a8dfb',
          500: '#6c6cf3',
          600: '#5b50e6',
          700: '#4c40cb',
          800: '#3f37a4',
          900: '#37337f',
        },
        ink: {
          50: '#f8f9fb',
          100: '#f1f3f6',
          200: '#e4e7ec',
          300: '#cfd4dc',
          400: '#98a1b0',
          500: '#6b7585',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        pop: '0 12px 32px -8px rgba(16,24,40,0.18), 0 4px 8px -4px rgba(16,24,40,0.08)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { opacity: 0, transform: 'translateX(16px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .35s ease-out both',
        'slide-in': 'slide-in .25s ease-out both',
      },
    },
  },
  plugins: [],
}
