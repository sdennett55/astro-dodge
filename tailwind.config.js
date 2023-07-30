/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        levelScreen: {
          '0%': {
            transform: 'translateY(-100%)'
          },
          '25%': {
            transform: 'translateY(0)'
          },
          '75%': {
            transform: 'translateY(0)'
          },
          '100%': {
            transform: 'translateY(100%)'
          }
        },
        idleHover: {
          '0%': {
            transform: 'translateY(0)'
          },
          '50%': {
            transform: 'translateY(25px)'
          },
          '100%': {
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        'level-screen': 'levelScreen 4s linear',
        'idle-hover': 'idleHover 1s linear infinite'
      }
    },
  },
  plugins: [],
}

