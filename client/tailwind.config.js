const colors = require('tailwindcss/colors');
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      exSMMAX: { min: '0px', max: '425px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }
      smMAX: { min: '0px', max: '767px' },
      // => @media (min-width: 640px and max-width: 767px) { ... }

      mdMAX: { min: '768px', max: '1023px' },
      // => @media (min-width: 768px and max-width: 1023px) { ... }

      lgMAX: { min: '1024px', max: '1279px' },
      // => @media (min-width: 1024px and max-width: 1279px) { ... }

      xlMAX: { min: '1280px', max: '1535px' },
      // => @media (min-width: 1280px and max-width: 1535px) { ... }

      '2xlMAX': { min: '1536px' },
      // => @media (min-width: 1536px) { ... }
    },
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
    },
    extend: {
      screens: {
        mf: '990px',
      },
      keyframes: {
        'slide-in': {
          '0%': {
            '-webkit-transform': 'translateX(120%)',
            transform: 'translateX(120%)',
          },
          '100%': {
            '-webkit-transform': 'translateX(0%)',
            transform: 'translateX(0%)',
          },
        },
        'slide-down': {
          '0%': {
            transform: 'translateY(-100%)',
            '-webkit-transform': 'translateY(-100%)',
          },
          '50%': {
            transform: 'translateY(8%)',
            '-webkit-transform': 'translateY(8%)',
          },
          '65%': {
            transform: 'translateY(-4%)',
            '-webkit-transform': 'translateY(-4%)',
          },
          '80%': {
            transform: 'translateY(4%)',
            '-webkit-transform': 'translateY(4%)',
          },
          '95%': {
            transform: 'translateY(-2%)',
            '-webkit-transform': 'translateY(-2%)',
          },
          '100%': {
            transform: 'translateY(0%)',
            '-webkit-transform': 'translateY(0%)',
          },
        },
      },

      animation: {
        'slide-in': 'slide-in 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // import tailwind forms
  ],
};
