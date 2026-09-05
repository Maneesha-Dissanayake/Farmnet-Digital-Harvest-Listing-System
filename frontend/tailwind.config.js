/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', '"Noto Sans Sinhala"', 'system-ui', 'sans-serif'],
        sinhala: ['"Noto Sans Sinhala"', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};