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
        }
      },
      animation: {
        'level-screen': 'levelScreen 3s linear'
      }
    },
  },
  plugins: [],
}

