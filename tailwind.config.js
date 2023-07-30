import { transform } from 'typescript'

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
        },
        titleScreen: {
          '0%': {
            transform: 'translateX(0)',
          }, 
          '50%': {
            transform: 'translateX(-300px)',
          },
          '100%': {
            transform: 'translateX(0)',
          },
        }
      },
      animation: {
        'level-screen': 'levelScreen 4s linear',
        'idle-hover': 'idleHover 1s linear infinite',
        'title-screen': 'titleScreen 60s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

