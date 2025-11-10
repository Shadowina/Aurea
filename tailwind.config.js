/** @type {import('tailwindcss').Config} */
export default {
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