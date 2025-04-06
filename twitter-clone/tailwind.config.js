/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#14b8a6', // teal-500
          light: '#5eead4', // teal-300
          dark: '#0f766e', // teal-700
        },
        accent: {
          DEFAULT: '#eab308', // amber-500
          light: '#fde047', // amber-300
          dark: '#b45309', // amber-700
        },
      },
    },
  },
  plugins: [],
}
