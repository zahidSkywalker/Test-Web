/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#111111',
        secondary: '#f3f4f6',
        accent: '#e11d48'
      },
    },
  },
  plugins: [],
}

