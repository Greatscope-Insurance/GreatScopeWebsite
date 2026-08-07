/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Open Sans', 'sans-serif'],
        display: ['Rubik', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#003478',
          darker: '#193656',
          muted: '#5d6b85',
          gold: '#f0a108',
          'gold-deep': '#d28e00',
          'gold-light': '#f0f4f9',
          paper: '#ffffff',
        },
      },
      boxShadow: {
        soft: '0 6px 24px -10px rgba(0,52,120,0.12)',
        card: '0 14px 40px -16px rgba(0,52,120,0.22)',
        lift: '0 24px 50px -20px rgba(0,52,120,0.30)',
      },
    },
  },
}
