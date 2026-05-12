/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        display: ['DM Serif Display', 'serif'],
      },
      colors: {
        'brand-dark': '#1E1B2E',
        'brand-muted': '#3B3552',
        'brand-gold': '#E4C680',
        'brand-gold-light': '#F8F4EC',
      }
    },
  },
}
