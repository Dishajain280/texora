/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          light: '#13253A',
          dark: '#081119',
        },
        gold: {
          DEFAULT: '#F2C230',
          light: '#FBDD7E',
          dark: '#D9A61E',
        },
        soft: '#EEF2FA',
      },
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        fadeUp: 'fadeUp 0.8s ease forwards',
        floaty: 'floaty 4s ease-in-out infinite',
        spinSlow: 'spinSlow 12s linear infinite',
      }
    },
  },
  plugins: [],
}
