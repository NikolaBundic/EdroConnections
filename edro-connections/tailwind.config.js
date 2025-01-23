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
          }
        },
        animation: {
          'slide-in': 'slideIn 0.3s ease-out',
          'slide-out': 'slideOut 0.3s ease-out'
        }
      },
    },
    plugins: [],
  }