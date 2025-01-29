/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          slideIn: {
            '0%': { transform: 'translateY(100%)' },
            '100%': { transform: 'translateY(0)' }
          },
          slideOut: {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(100%)' }
          },
          fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' }
          }
        },
        animation: {
          'slide-in': 'slideIn 0.3s ease-out',
          'slide-out': 'slideOut 0.3s ease-out',
          'fadeIn': 'fadeIn 1s ease-out'
        }
      },
    },
    plugins: [],
  }