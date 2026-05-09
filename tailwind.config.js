/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: '#F8F7F4',
        neutral: '#EAEAEA',
        teal: '#78C0A8',
        peach: '#F7A399',
        charcoal: '#333333',
        midnight: '#1F2933',
        slate: {
          50: '#f3f6f9',
          100: '#e6ecf2',
          200: '#cdd7e1',
          300: '#aab9c7',
          400: '#8698a9',
          500: '#647688',
          600: '#4a5b6c',
          700: '#384654',
          800: '#2a3541',
          900: '#1F2933',
          950: '#12171c',
        },
      },
      fontFamily: {
        heading: ['"Nunito"', 'sans-serif'],
        body: ['"Lato"', '"Open Sans"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(31, 41, 51, 0.15)',
      },
    },
  },
  plugins: [],
} 