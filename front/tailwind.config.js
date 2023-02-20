/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', ...defaultTheme.fontFamily.sans],
        serif: [
          'PT Serif',
          'Libre Baskerville',
          // 'Merriweather',
          'Playfair Display',
          ...defaultTheme.fontFamily.mono,
        ],
      },
    },
  },
  plugins: [],
}
