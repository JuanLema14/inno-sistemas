/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3260ab',
        secondary: '#41c1f0',
        third: '#3260ab',
        accent: '#fbfbfb',
        dark: '#f3edfa'
      },
    },
  },
  plugins: [],
}

