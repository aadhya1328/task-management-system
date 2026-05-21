/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mocha: {
          50: '#fdfbfb',
          100: '#f5ebe6',
          200: '#e8d2c4',
          300: '#d7b3a0',
          400: '#c5927c',
          500: '#b3715c',
          600: '#9b5846',
          700: '#7f4437',
          800: '#64342b',
          900: '#4c2621',
          950: '#2d1411',
        },
      },
    },
  },
  plugins: [],
}
