/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#0D1B2A', light: '#13253A', dark: '#081119' },
        gold: { DEFAULT: '#F2C230', light: '#FBDD7E', dark: '#D9A61E' },
        soft: '#F4F6FB',
      },
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
