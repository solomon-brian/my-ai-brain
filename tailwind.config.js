/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}" ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        'brand-purple': '#7A5AF8',
      }
    },
  },
  plugins: [],
};