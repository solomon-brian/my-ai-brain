/** @type {import('tailwindcss').Config} */
module.
exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Use Inter as the primary font
      },
    },
  },
  plugins: [],
};