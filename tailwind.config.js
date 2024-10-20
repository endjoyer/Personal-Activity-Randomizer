/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    screens: {
      mobil: '500px',
      // => @media (min-width: 500px) { ... }

      sm: '840px',
      // => @media (min-width: 840px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      colors: {
        cream: '#ebdaae', // ваш светло-кремовый цвет
      },
      width: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};
