/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
      'steelblue': '#00141f',
    },
    fontFamily: {
      'nunito': ['Nunito Sans', 'sans-serif'],
      'nunito-bold': ['Nunito Sans Bold', 'sans-serif'],
      'nunito-extra-bold': ['Nunito Sans Extra Bold', 'sans-serif'],
      
    },
  },
  },
  plugins: [],
}
