/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 60s linear infinite',
        paused: 'marquee 60s linear infinite paused',
      },
      keyframes: {
        marquee: {
          '100%': { transform: 'translateX(100%)' }, 
          '0%': { transform: 'translateX(-100%)' }, 
        },
      },
    },
  },
  plugins: [
    require("@material-tailwind/react/utils/withMT"),
  ],
}
