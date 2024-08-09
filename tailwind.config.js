/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily:{
      'sriracha': ['Sriracha', 'cursive'],
      'rowdies': ['Rowdies', 'cursive'],
    },
  },
  plugins: [
    require('daisyui')
  ],
  daisyui: {
    themes: ["retro"],
  },
}