// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {
//       animation: {
//         marquee: 'marquee 35s linear infinite',
//         paused: 'marquee 35s linear infinite paused',
//         // Add the fadeIn animation here
//         fadeIn: 'fadeIn 0.3s ease-out forwards',
//       },
//       keyframes: {
//         marquee: {
//           '100%': { transform: 'translateX(100%)' },
//           '0%': { transform: 'translateX(-100%)' },
//         },
//         // Add the fadeIn keyframes here
//         fadeIn: {
//           '0%': { opacity: '0', transform: 'translateY(-20px)' },
//           '100%': { opacity: '1', transform: 'translateY(0)' },
//         }
//       },
//       // You might also want to add backdrop blur utilities if not already using them
//       backdropBlur: {
//         sm: '4px',
//         DEFAULT: '8px',
//         md: '12px',
//         lg: '16px',
//       },
//     },
//   },
//   plugins: [
//     require("@material-tailwind/react/utils/withMT"),
//   ],
// }
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 35s linear infinite',
        paused: 'marquee 35s linear infinite paused',
        // Add the fadeIn animation here
        fadeIn: 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        // Add the fadeIn keyframes here
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      // You might also want to add backdrop blur utilities if not already using them
      backdropBlur: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [
    require("@material-tailwind/react/utils/withMT"),
  ],
}